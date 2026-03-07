export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  order: number;
  text: string;
  tokenEstimate: number;
}

export interface EmbeddingRecord {
  chunkId: string;
  dimensions: number;
  model: string;
  vectorId: string;
}

export function buildChunkId(documentId: string, order: number): string {
  return `${documentId}:chunk:${String(order).padStart(4, "0")}`;
}

export const exampleChunk: DocumentChunk = {
  chunkId: buildChunkId("kb_321", 1),
  documentId: "kb_321",
  order: 1,
  text: "Escalate to the database owner when replication lag exceeds ten minutes.",
  tokenEstimate: 17,
};
