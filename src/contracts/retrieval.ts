export interface RetrievalCandidate {
  chunkId: string;
  lexicalScore: number;
  semanticScore: number;
  freshnessScore: number;
}

export interface RankedResult extends RetrievalCandidate {
  finalScore: number;
  rank: number;
}

export interface RetrievalTrace {
  query: string;
  results: RankedResult[];
  traceId: string;
}

export function combineScores(candidate: RetrievalCandidate): number {
  return Number(
    (candidate.semanticScore * 0.6 + candidate.lexicalScore * 0.3 + candidate.freshnessScore * 0.1).toFixed(4),
  );
}

export function rankCandidates(candidates: RetrievalCandidate[]): RankedResult[] {
  return candidates
    .map((candidate) => ({ ...candidate, finalScore: combineScores(candidate) }))
    .sort((left, right) => right.finalScore - left.finalScore)
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));
}
