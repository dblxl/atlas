import type { EmbeddingAdapter } from "../pipeline/embed.js";
import type { VectorStore } from "../pipeline/store.js";
import type { DocumentChunk } from "../pipeline/chunk.js";
import { search } from "../retrieval/query.js";
import type { RankedResult } from "../retrieval/rank.js";
import { computeMetrics, type EvalPair, type EvalResult } from "./metrics.js";

/**
 * Run an evaluation set against the given store and embedding adapter.
 *
 * For each pair, performs a top-5 semantic search, then computes recall@5 and MRR.
 */
export async function runEvaluation(
  pairs: EvalPair[],
  store: VectorStore & {
    entries: Map<string, { chunk: DocumentChunk; embedding: number[] }>;
  },
  embedAdapter: EmbeddingAdapter,
): Promise<EvalResult> {
  const results = new Map<string, RankedResult[]>();

  for (const pair of pairs) {
    const { results: ranked } = await search(
      pair.query,
      { topK: 5 },
      store,
      embedAdapter,
    );
    results.set(pair.query, ranked);
  }

  return computeMetrics(pairs, results);
}

/**
 * Print an `EvalResult` to stdout in a human-readable format.
 */
export function printEvalResult(result: EvalResult): void {
  process.stdout.write("=== Atlas Evaluation Results ===\n");
  process.stdout.write(`Queries evaluated : ${result.queryCount}\n`);
  process.stdout.write(`Recall@5          : ${(result.recallAt5 * 100).toFixed(1)}%\n`);
  process.stdout.write(`MRR               : ${result.mrr.toFixed(4)}\n`);
}
