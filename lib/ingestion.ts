import type { TraceableItem, WorkspaceInput, SourceFile } from '../types/workspace';

function roleFor(mime: string, name: string): string {
  if (mime.includes('pdf') || /report|summary/i.test(name)) return 'report';
  if (mime.includes('presentation') || /ppt|deck|slide/i.test(name)) return 'presentation deck';
  if (mime.includes('sheet') || /csv|xlsx|tsv/i.test(name)) return 'spreadsheet/data table';
  if (mime.startsWith('image/')) return 'image reference';
  if (mime.startsWith('audio/') || mime.startsWith('video/')) return 'transcript source';
  return 'mixed project material';
}

export function ingestInputs(inputs: WorkspaceInput[]): { sourceFiles: SourceFile[]; extractedBlocks: TraceableItem<string>[] } {
  const now = new Date().toISOString();
  return {
    sourceFiles: inputs.map((input, index) => ({
      id: `file-${index + 1}`,
      name: input.name,
      mimeType: input.mimeType,
      size: input.content.length,
      role: roleFor(input.mimeType, input.name),
      parser: input.mimeType.includes('json') ? 'json-parser' : 'text-parser',
      confidence: input.content.trim().length > 0 ? 0.8 : 0.3,
      status: input.content.trim().length > 0 ? 'extracted' : 'failed-extraction',
      rawContent: input.content
    })),
    extractedBlocks: inputs.flatMap((input, index) => {
      const segments = input.content.split(/\n{2,}/).filter(Boolean);
      return segments.map((segment, segmentIndex) => ({
        id: `block-${index + 1}-${segmentIndex + 1}`,
        type: 'text-block',
        label: `${input.name} segment ${segmentIndex + 1}`,
        value: segment.trim(),
        sourceFileId: `file-${index + 1}`,
        sourceLocation: `segment:${segmentIndex + 1}`,
        parserUsed: input.mimeType.includes('json') ? 'json-parser' : 'text-parser',
        confidence: 0.75,
        status: 'extracted',
        createdAt: now,
        updatedAt: now
      }));
    })
  };
}
