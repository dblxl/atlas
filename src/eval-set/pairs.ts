import type { EvalPair } from "../eval/metrics.js";

/**
 * Evaluation pairs for the Atlas sample corpus.
 *
 * Each expectedChunkId is the chunkId produced by:
 *   chunkText(text, sourceId, { chunkSize: 100, overlap: 20 })
 * where sourceId is the filename (without path) and the first chunk
 * is always `${sourceId}-chunk-0`.
 */
export const evalPairs: EvalPair[] = [
  {
    query: "What is retrieval-augmented generation and how does it reduce hallucination?",
    expectedChunkId: "retrieval-augmented-generation.md-chunk-0",
  },
  {
    query: "What is fixed-size chunking and what role does overlap play?",
    expectedChunkId: "chunking-strategies.md-chunk-0",
  },
  {
    query: "What does an embedding model do and what is the typical vector dimensionality?",
    expectedChunkId: "embedding-models.md-chunk-0",
  },
  {
    query: "How do you install and enable the pgvector extension in PostgreSQL?",
    expectedChunkId: "pgvector-setup.md-chunk-0",
  },
  {
    query: "What is recall@5 and why is it used to evaluate retrieval systems?",
    expectedChunkId: "evaluation-metrics.md-chunk-0",
  },
];
