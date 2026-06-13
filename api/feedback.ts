/**
 * Vercel Edge Function — POST /api/feedback
 *
 * Body: { title: string; body: string }
 * Creates a GitHub issue on backtest-validation-guide with label "suggestion".
 *
 * Requires env var: GITHUB_TOKEN (fine-grained PAT with Issues: Read & Write
 * on this repo only — no other permissions needed).
 *
 * Returns:
 *   200 { url: string }   — issue created, url is the new issue URL
 *   400 { error: string } — bad request
 *   429 { error: string } — rate limited (>10 req / IP / minute)
 *   503 { error: string } — GITHUB_TOKEN not set (falls back to client-side URL)
 */

export const config = { runtime: 'edge' };

const REPO = 'darrenadixonpi/backtest-validation-guide';
const RATE_LIMIT = 10; // max requests per IP per window
const WINDOW_MS = 60_000;

// Simple in-memory rate limiter (resets per edge instance restart — good enough)
const ipCounts = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.reset) {
    ipCounts.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false; // not limited
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://backtest-validation-guide.vercel.app',
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': 'https://backtest-validation-guide.vercel.app',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const token = process.env.GITHUB_TOKEN;
  if (!token) return json({ error: 'Not configured' }, 503);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (rateLimit(ip)) return json({ error: 'Too many requests — try again in a minute' }, 429);

  let title: string, body: string;
  try {
    ({ title, body } = await req.json());
    if (!title?.trim() || !body?.trim()) throw new Error('empty');
    if (title.length > 256 || body.length > 8000) throw new Error('too long');
  } catch {
    return json({ error: 'Invalid request body' }, 400);
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
