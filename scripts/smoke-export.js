const fs = require('node:fs');
const source = fs.readFileSync('lib/export.ts', 'utf8');
if (!source.includes('export')) {
  console.error('Export utilities missing.');
  process.exit(1);
}
console.log('Export smoke passed.');
