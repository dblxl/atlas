export interface ChunkConfig {
  /** Approximate chunk size in words (token proxy). */
  chunkSize: number;
  /** Number of overlapping words between adjacent chunks. */
  overlap: number;
}

export interface DocumentChunk {
  /** Deterministic ID: `${sourceId}-chunk-${index}` */
  chunkId: string;
  text: string;
  sourceId: string;
  chunkIndex: number;
}

/**
 * Split `text` into overlapping chunks of approximately `chunkSize` words.
 *
 * Edge cases:
 * - Empty text → []
 * - Text shorter than chunkSize → single chunk containing the full text
 */
export function chunkText(
  text: string,
  sourceId: string,
  config: ChunkConfig,
): DocumentChunk[] {
  const { chunkSize, overlap } = config;

  if (!text.trim()) {
    return [];
  }

  const words = text.split(/\s+/).filter((w) => w.length > 0);

  if (words.length === 0) {
    return [];
  }

  if (words.length <= chunkSize) {
    return [
      {
        chunkId: `${sourceId}-chunk-0`,
        text: words.join(" "),
        sourceId,
        chunkIndex: 0,
      },
    ];
  }

  const step = Math.max(1, chunkSize - overlap);
  const chunks: DocumentChunk[] = [];
  let index = 0;
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push({
      chunkId: `${sourceId}-chunk-${index}`,
      text: words.slice(start, end).join(" "),
      sourceId,
      chunkIndex: index,
    });
    index++;
    start += step;
  }

  return chunks;
}
