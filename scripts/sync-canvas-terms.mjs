import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const termsPath = path.join(__dirname, '../src/data/terms.ts');
const raw = fs.readFileSync(termsPath, 'utf8');

// Strip types/exports and evaluate the array literal in an isolated function
const body = raw
  .replace(/^import[^\n]+\n/m, '')
  .replace(/^export const TERMS: Term\[\] = /m, 'return ')
  .replace(/;\s*export function termById[\s\S]*$/m, ';');

const TERMS = new Function(body)();

const snippet =
  'const TERMS: Term[] = [\n' +
  TERMS.map((t) => {
    const lines = [
      `    id: ${JSON.stringify(t.id)},`,
      `    name: ${JSON.stringify(t.name)},`,
      ...(t.aliases ? [`    aliases: ${JSON.stringify(t.aliases)},`] : []),
      `    category: ${JSON.stringify(t.category)},`,
      `    beginner:\n      ${JSON.stringify(t.beginner)},`,
      `    professional:\n      ${JSON.stringify(t.professional)},`,
      ...(t.math ? [`    math: ${JSON.stringify(t.math)},`] : []),
      `    related: ${JSON.stringify(t.related)},`,
    ];
    return `  {\n${lines.join('\n')}\n  }`;
  }).join(',\n') +
  '\n];';

const canvasPath =
  'C:/Users/darre/.cursor/projects/empty-window/canvases/backtest-validation-guide.canvas.tsx';
let canvas = fs.readFileSync(canvasPath, 'utf8');
canvas = canvas.replace(/const TERMS: Term\[\] = \[[\s\S]*?\n\];/, snippet);
fs.writeFileSync(canvasPath, canvas);
console.log(`Synced ${TERMS.length} terms to canvas`);
