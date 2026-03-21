import { describe, it, expect } from "vitest";
import { rankCandidates, type RetrievalCandidate } from "./rank.js";

function makeCandidate(id: string, score: number): RetrievalCandidate {
  return { chunkId: id, text: `text-${id}`, sourceId: "src", score };
}

describe("rankCandidates", () => {
  it("returns [] for empty candidates", () => {
    expect(rankCandidates([], 5)).toEqual([]);
  });

  it("returns [] when k=0", () => {
    const candidates = [makeCandidate("a", 0.9), makeCandidate("b", 0.5)];
    expect(rankCandidates(candidates, 0)).toEqual([]);
  });

  it("returns all candidates when k > candidates.length", () => {
    const candidates = [makeCandidate("a", 0.8), makeCandidate("b", 0.6)];
    const result = rankCandidates(candidates, 10);
    expect(result).toHaveLength(2);
  });

  it("results are sorted by finalScore descending", () => {
    const candidates = [
      makeCandidate("low", 0.2),
      makeCandidate("high", 0.9),
      makeCandidate("mid", 0.5),
    ];
    const result = rankCandidates(candidates, 3);
    expect(result[0]?.finalScore).toBe(0.9);
    expect(result[1]?.finalScore).toBe(0.5);
    expect(result[2]?.finalScore).toBe(0.2);
  });

  it("rank values start at 1 and increment by 1", () => {
    const candidates = [
      makeCandidate("a", 0.9),
      makeCandidate("b", 0.7),
      makeCandidate("c", 0.4),
    ];
    const result = rankCandidates(candidates, 3);
    result.forEach((r, i) => {
      expect(r.rank).toBe(i + 1);
    });
  });

  it("returns exactly min(k, candidates.length) results", () => {
    const candidates = [
      makeCandidate("a", 0.9),
      makeCandidate("b", 0.7),
      makeCandidate("c", 0.5),
      makeCandidate("d", 0.3),
    ];
    expect(rankCandidates(candidates, 2)).toHaveLength(2);
    expect(rankCandidates(candidates, 4)).toHaveLength(4);
    expect(rankCandidates(candidates, 10)).toHaveLength(4);
  });

  it("does not mutate the original candidates array", () => {
    const candidates = [makeCandidate("a", 0.3), makeCandidate("b", 0.9)];
    const original = candidates.map((c) => ({ ...c }));
    rankCandidates(candidates, 2);
    expect(candidates[0]?.score).toBe(original[0]?.score);
    expect(candidates[1]?.score).toBe(original[1]?.score);
  });
});
