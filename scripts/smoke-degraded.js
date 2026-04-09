const fs = require('node:fs');
const source = fs.readFileSync('lib/workspace-context.tsx', 'utf8');
if (!source.includes("state: 'degraded'")) {
  console.error('Expected degraded runtime default handling in workspace context.');
  process.exit(1);
}
console.log('Degraded mode smoke passed.');
