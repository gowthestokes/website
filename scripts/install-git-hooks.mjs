import { execFileSync } from 'node:child_process';

try {
  execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' });
  execFileSync('git', ['config', 'core.hooksPath', '.githooks']);
  console.log('Configured repository Git hooks.');
} catch {
  console.log('Skipping Git hook setup outside a Git repository.');
}
