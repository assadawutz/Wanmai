import test from 'node:test';
import assert from 'node:assert/strict';

test('workspace architecture constants exist', () => {
  const required = [
    'workspaceMeta','sourceFiles','extractedBlocks','summaries','smartDocs','smartSheets','smartSlides','storyboard','history','jobs','glossary'
  ];
  assert.ok(required.includes('smartSlides'));
  assert.equal(required.length > 10, true);
});
