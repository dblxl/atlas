import { buildChunkId, exampleChunk } from "../contracts/chunk.ts";
import { summarizeMetrics } from "../contracts/observability.ts";
import { rankCandidates } from "../contracts/retrieval.ts";
import { exampleIngestionBatch, stableDocumentKey } from "../contracts/source.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function validateSourceContracts(): void {
  assert(exampleIngestionBatch.documents.length > 0, "Example ingestion batch must include at least one document.");
  const document = exampleIngestionBatch.documents[0];
  assert(
    stableDocumentKey(document) === `${document.kind}:${document.id}:${document.checksum}`,
    "Stable document key must compose kind, id, and checksum in order.",
  );
}

function validateChunkContracts(): void {
  assert(exampleChunk.chunkId === buildChunkId(exampleChunk.documentId, exampleChunk.order), "Example chunk id must match the chunk id helper.");
  assert(exampleChunk.tokenEstimate > 0, "Example chunk token estimate must be positive.");
}

function validateRetrievalContracts(): void {
  const ranked = rankCandidates([
    { chunkId: "c1", lexicalScore: 0.4, semanticScore: 0.9, freshnessScore: 0.2 },
    { chunkId: "c2", lexicalScore: 0.8, semanticScore: 0.5, freshnessScore: 0.4 },
    { chunkId: "c3", lexicalScore: 0.3, semanticScore: 0.3, freshnessScore: 0.1 },
  ]);

  assert(ranked.length === 3, "Ranked retrieval results must preserve candidate count.");
  assert(ranked[0].finalScore >= ranked[1].finalScore, "Ranked retrieval results must be sorted descending.");
  assert(ranked[0].rank === 1 && ranked[2].rank === 3, "Ranked retrieval results must assign stable rank values.");
}

function validateObservabilityContracts(): void {
  const summary = summarizeMetrics([
    { name: "recall_at_5", value: 0.82 },
    { name: "mrr", value: 0.71 },
  ]);

  assert(summary.includes("recall_at_5=0.82"), "Metrics summary must include recall_at_5.");
  assert(summary.includes("mrr=0.71"), "Metrics summary must include mrr.");
}

function main(): void {
  validateSourceContracts();
  validateChunkContracts();
  validateRetrievalContracts();
  validateObservabilityContracts();
  process.stdout.write("Validated atlas contract samples and helper behavior.\n");
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
