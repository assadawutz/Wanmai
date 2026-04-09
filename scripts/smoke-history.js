const fs = require('node:fs');
const source = fs.readFileSync('lib/history.ts', 'utf8');
if (!source.includes('restoreSnapshot')) {
  console.error('History restore path missing.');
  process.exit(1);
}
console.log('History smoke passed.');
