import type { RankedResult } from "../retrieval/rank.js";

export interface EvalPair {
  query: string;
  expectedChunkId: string;
}

export interface EvalResult {
  /** Fraction of queries where expectedChunkId appears in top-5 results. In [0, 1]. */
  recallAt5: number;
  /** Mean reciprocal rank: 1/rank if found, 0 if not. In [0, 1]. */
  mrr: number;
  /** Number of query/answer pairs evaluated. */
  queryCount: number;
}

/**
 * Compute recall@5 and MRR for a set of evaluation pairs.
 *
 * @param pairs   - Query/expected-chunk-id pairs from the evaluation set.
 * @param results - Map from query string to ranked results (topK=5 expected).
 */
export function computeMetrics(
  pairs: EvalPair[],
  results: Map<string, RankedResult[]>,
): EvalResult {
  if (pairs.length === 0) {
    return { recallAt5: 0, mrr: 0, queryCount: 0 };
  }

  let recallHits = 0;
  let mrrSum = 0;

  for (const pair of pairs) {
    const ranked = results.get(pair.query) ?? [];
    const top5 = ranked.slice(0, 5);

    const matchIndex = top5.findIndex((r) => r.chunkId === pair.expectedChunkId);

    if (matchIndex !== -1) {
      recallHits += 1;
      mrrSum += 1 / (matchIndex + 1);
    }
  }

  return {
    recallAt5: recallHits / pairs.length,
    mrr: mrrSum / pairs.length,
    queryCount: pairs.length,
  };
}
