const fs = require('node:fs');
const source = fs.readFileSync('lib/route-definitions.ts', 'utf8');
const required = ['/home', '/intake', '/understand/summary', '/build/docs', '/review/readiness', '/operate/issues', '/roles/pm', '/system/runtime'];
const missing = required.filter((route) => !source.includes(`'${route}'`));
if (missing.length > 0) {
  console.error('Missing route definitions:', missing.join(', '));
  process.exit(1);
}
console.log('Route smoke passed.');
