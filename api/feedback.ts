/**
 * Vercel Serverless Function — POST /api/feedback  (Node.js runtime)
 *
 * Runs on the Node.js runtime (NOT Edge): it holds a TCP connection to Redis via
 * node-redis, and the Edge runtime can't open raw sockets. No `config.runtime`
 * export is needed — /api functions default to Node.
 *
 * Body: { title, body, hp, elapsedMs, turnstileToken }
 * Creates a GitHub issue on backtest-validation-guide with label "suggestion".
 *
 * Spam defenses (cheapest first):
 *   1. Honeypot   — hidden `hp` field; if filled, silently pretend success.
 *   2. Time-trap  — reject submissions faster than MIN_FILL_MS.
 *   3. Rate limit — RATE_LIMIT per IP per window (Redis; in-memory fallback).
 *   4. Turnstile  — Cloudflare bot check, verified server-side.
 * CORS only constrains browsers, so all of these run server-side: a bot POSTing
 * directly with curl still has to clear them.
 *
 * Env vars:
 *   GITHUB_TOKEN          — fine-grained PAT, Issues R/W on this repo only (required).
 *   TURNSTILE_SECRET_KEY  — Cloudflare Turnstile secret. If unset, the check is skipped.
 *   REDIS_URL             — Redis connection string (redis:// or rediss://). If unset,
 *                           falls back to a best-effort per-instance in-memory limiter.
 *
 * Returns:
 *   200 { url, number } — issue created
 *   200 { ok: true }    — honeypot tripped (silent no-op)
 *   400 { error }       — bad request / submitted too quickly
 *   403 { error }       — failed bot verification
 *   429 { error }       — rate limited
 *   503 { error }       — GITHUB_TOKEN not set (client falls back to GitHub URL)
 */

import { createClient } from 'redis';

const REPO = 'darrenadixonpi/backtest-validation-guide';
const RATE_LIMIT = 10; // max requests per IP per window
const WINDOW_S = 60; // rate-limit window (seconds)
const WINDOW_MS = WINDOW_S * 1000;
const MIN_FILL_MS = 2000; // reject anything submitted faster than this

const ALLOW_ORIGIN = 'https://backtest-validation-guide.vercel.app';
const REDIS_URL = process.env.REDIS_URL;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

// --- Rate limiting -----------------------------------------------------------

// Reuse one Redis client across warm invocations: created lazily at module scope
// so a hot function reuses the open connection instead of dialing on every request.
type RedisClient = ReturnType<typeof createClient>;
let clientPromise: Promise<RedisClient> | null = null;

function getRedis(): Promise<RedisClient> | null {
  if (!REDIS_URL) return null;
  if (!clientPromise) {
    const client = createClient({ url: REDIS_URL });
    client.on('error', (err) => console.error('Redis client error:', err));
    clientPromise = client.connect().catch((err) => {
      clientPromise = null; // reset so a later invocation can retry the connection
      throw err;
    });
  }
  return clientPromise;
}

// Shared, cross-instance limiter via Redis (fixed window).
async function redisRateLimited(ip: string): Promise<boolean> {
  const redis = await getRedis()!;
  const key = `rl:feedback:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, WINDOW_S); // set the TTL once per window
  return count > RATE_LIMIT;
}

// Best-effort fallback: per-instance, resets on cold start.
const ipCounts = new Map<string, { count: number; reset: number }>();
function memRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.reset) {
    ipCounts.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

async function rateLimited(ip: string): Promise<boolean> {
  if (REDIS_URL) {
    try {
      return await redisRateLimited(ip);
    } catch (e) {
      console.error('Redis rate-limit failed, falling back to memory:', e);
    }
  }
  return memRateLimited(ip);
}

// --- Turnstile ---------------------------------------------------------------

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // not configured — skip (dev / not yet set up)
  if (!token) return false;

  const form = new URLSearchParams();
  form.set('secret', TURNSTILE_SECRET);
  form.set('response', token);
  if (ip && ip !== 'unknown') form.set('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// --- Helpers -----------------------------------------------------------------

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    },
  });
}

// --- Handler -----------------------------------------------------------------

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': ALLOW_ORIGIN,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const token = process.env.GITHUB_TOKEN;
  if (!token) return json({ error: 'Not configured' }, 503);

  // Parse body.
  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  // 1. Honeypot — if the hidden field has anything in it, it's a bot.
  //    Return a success-shaped response so the bot learns nothing.
  const hp = typeof payload.hp === 'string' ? payload.hp : '';
  if (hp.trim() !== '') return json({ ok: true });

  // Field validation.
  const title = typeof payload.title === 'string' ? payload.title : '';
  const body = typeof payload.body === 'string' ? payload.body : '';
  if (!title.trim() || !body.trim()) return json({ error: 'Invalid request body' }, 400);
  if (title.length > 256 || body.length > 8000) return json({ error: 'Too long' }, 400);

  // 2. Time-trap — humans take more than a couple seconds to write a suggestion.
  const elapsedMs = typeof payload.elapsedMs === 'number' ? payload.elapsedMs : -1;
  if (elapsedMs < MIN_FILL_MS) {
    return json({ error: 'Submitted too quickly — please try again' }, 400);
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  // 3. Rate limit.
  if (await rateLimited(ip)) {
    return json({ error: 'Too many requests — try again in a minute' }, 429);
  }

  // 4. Turnstile.
  const turnstileToken = typeof payload.turnstileToken === 'string' ? payload.turnstileToken : '';
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return json({ error: 'Verification failed — please retry' }, 403);
  }

  const resp = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'backtest-validation-guide-feedback',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ title, body, labels: ['suggestion'] }),
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => 'unknown');
    console.error('GitHub API error:', resp.status, err);
    return json({ error: 'Failed to create issue — try the GitHub link instead' }, 502);
  }

  const issue = (await resp.json()) as { html_url: string; number: number };
  return json({ url: issue.html_url, number: issue.number });
}
