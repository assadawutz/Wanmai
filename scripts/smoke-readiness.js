const fs = require('node:fs');
const source = fs.readFileSync('lib/part3-policy.ts', 'utf8');
if (!source.includes('Ready to share') || !source.includes('Not ready for external viewing')) {
  console.error('Readiness verdict contract missing.');
  process.exit(1);
}
console.log('Readiness smoke passed.');
