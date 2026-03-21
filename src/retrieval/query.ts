import type { DocumentChunk } from "../pipeline/chunk.js";
import type { EmbeddingAdapter } from "../pipeline/embed.js";
import type { VectorStore } from "../pipeline/store.js";
import { rankCandidates, type RankedResult, type RetrievalCandidate } from "./rank.js";

export interface QueryConfig {
  topK: number;
}

/**
 * Cosine similarity between two equal-length vectors.
 * Returns a value in [-1, 1]; returns 0 when either vector is the zero vector.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Perform top-k semantic search over an in-memory vector store.
 *
 * Embeds `query`, computes cosine similarity against every stored entry,
 * and returns the top-k results ranked by similarity score.
 *
 * @returns Ranked results and the wall-clock time spent embedding the query.
 */
export async function search(
  query: string,
  config: QueryConfig,
  store: VectorStore & {
    entries: Map<string, { chunk: DocumentChunk; embedding: number[] }>;
  },
  embedAdapter: EmbeddingAdapter,
): Promise<{ results: RankedResult[]; embeddingLatencyMs: number }> {
  const embedStart = Date.now();
  const vectors = await embedAdapter.embed([query]);
  const embeddingLatencyMs = Date.now() - embedStart;

  const queryEmbedding = vectors[0];
  if (!queryEmbedding) {
    return { results: [], embeddingLatencyMs };
  }

  const candidates: RetrievalCandidate[] = [];
  for (const [, entry] of store.entries) {
    candidates.push({
      chunkId: entry.chunk.chunkId,
      text: entry.chunk.text,
      sourceId: entry.chunk.sourceId,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
    });
  }

  return {
    results: rankCandidates(candidates, config.topK),
    embeddingLatencyMs,
  };
}
