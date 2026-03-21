import { combineScores as contractCombineScores } from "../contracts/retrieval.js";

// Re-export combineScores from the contracts layer so callers that previously
// imported it from there can migrate to this module without a breaking change.
export { contractCombineScores as combineScores };

/**
 * A candidate produced by the semantic search step.
 * `score` is the raw cosine similarity in [-1, 1].
 */
export interface RetrievalCandidate {
  chunkId: string;
  text: string;
  sourceId: string;
  score: number;
}

/**
 * A candidate after ranking — score is promoted to `finalScore` and a
 * 1-based `rank` is assigned.
 */
export interface RankedResult {
  chunkId: string;
  text: string;
  sourceId: string;
  finalScore: number;
  rank: number;
}

/**
 * Sort `candidates` by `score` descending, take the top `k`, and assign
 * `rank` starting at 1.
 *
 * Returns at most `min(k, candidates.length)` results.
 */
export function rankCandidates(
  candidates: RetrievalCandidate[],
  k: number,
): RankedResult[] {
  return candidates
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((candidate, index) => ({
      chunkId: candidate.chunkId,
      text: candidate.text,
      sourceId: candidate.sourceId,
      finalScore: candidate.score,
      rank: index + 1,
    }));
}
