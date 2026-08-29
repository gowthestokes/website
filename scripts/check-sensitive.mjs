import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const rules = [
  ['email address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi],
  ['North American phone number', /(?<![\w.-])(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?){2}\d{4}(?!\w)/g],
  ['international phone number', /\+\d(?:[\s().-]*\d){7,14}\b/g],
  ['private key', /-----BEGIN(?: [A-Z0-9]+)? PRIVATE KEY-----/g],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9_]{36,255}|github_pat_[A-Za-z0-9_]{22,255})\b/g],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g],
  ['OpenAI API key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g],
  ['Stripe secret key', /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g],
  ['possible hard-coded secret', /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"'\n]{8,}["']/gi],
];

const scanAllTrackedFiles = process.argv.includes('--all');
const gitArgs = scanAllTrackedFiles
  ? ['ls-files', '-z']
  : ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'];

const stagedFiles = execFileSync('git', gitArgs, { encoding: 'buffer' })
  .toString('utf8')
  .split('\0')
  .filter(Boolean);

const findings = [];

for (const file of stagedFiles) {
  if (!existsSync(file)) continue;

  const contents = readFileSync(file);
  if (contents.includes(0)) continue;

  const text = contents.toString('utf8');
  for (const [label, pattern] of rules) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (!match) continue;

    const line = text.slice(0, match.index).split('\n').length;
    findings.push(`${file}:${line} — ${label}`);
  }
}

if (findings.length) {
  console.error('\nSensitive-data check failed. Remove or move these values before committing:\n');
  console.error(findings.map((finding) => `  • ${finding}`).join('\n'));
  console.error('\nThis scanner intentionally does not print the matched value.\n');
  process.exit(1);
}

console.log('Sensitive-data check passed.');
