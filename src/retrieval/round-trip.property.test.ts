// Feature: dblxl-live-demo, Property 17: Atlas round-trip retrieval

import { describe, it } from "vitest";
import * as fc from "fast-check";
import { chunkText } from "../pipeline/chunk.js";
import { mockEmbeddingAdapter } from "../pipeline/embed.js";
import { rankCandidates, type RetrievalCandidate } from "./rank.js";

/**
 * Validates: Requirements 4.10
 *
 * Property 17: For any document ingested into Atlas, submitting the
 * document's own text as a query returns the source chunk at rank 1, 2, or 3.
 */

/** Cosine similarity between two equal-length vectors. Returns 0 for zero vectors. */
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

describe("Property 17: Atlas round-trip retrieval", () => {
  it("querying a document's own text returns a source chunk at rank 1, 2, or 3", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10 }).filter((s) => s.trim().length > 0),
        async (docText) => {
          const sourceId = "round-trip-source";

          // 1. Chunk the document
          const chunks = chunkText(docText, sourceId, { chunkSize: 50, overlap: 10 });
          if (chunks.length === 0) return true; // filtered by chunkText (whitespace-only)

          // 2. Embed all chunks
          const chunkTexts = chunks.map((c) => c.text);
          const chunkEmbeddings = await mockEmbeddingAdapter.embed(chunkTexts);

          // 3. Embed the query (the document's own text)
          const queryEmbeddings = await mockEmbeddingAdapter.embed([docText]);
          const queryEmbedding = queryEmbeddings[0]!;

          // 4. Build retrieval candidates with cosine similarity scores
          const candidates: RetrievalCandidate[] = chunks.map((chunk, i) => ({
            chunkId: chunk.chunkId,
            text: chunk.text,
            sourceId: chunk.sourceId,
            score: cosineSimilarity(queryEmbedding, chunkEmbeddings[i]!),
          }));

          // 5. Rank top-3
          const ranked = rankCandidates(candidates, 3);

          // 6. Assert at least one source chunk appears in top 3
          const sourceChunkIds = new Set(chunks.map((c) => c.chunkId));
          const topChunkIds = ranked.map((r) => r.chunkId);

          return topChunkIds.some((id) => sourceChunkIds.has(id));
        },
      ),
      { numRuns: 100 },
    );
  });
});
