// Feature: dblxl-live-demo, Property 14: Top-k ranking invariant

import { describe, it } from "vitest";
import * as fc from "fast-check";
import { rankCandidates } from "./rank.js";
import type { RetrievalCandidate } from "./rank.js";

/**
 * Validates: Requirements 4.4
 *
 * Property 14: For any list of RetrievalCandidate objects and any k,
 * rankCandidates returns min(k, candidates.length) items sorted by
 * finalScore descending with rank starting at 1.
 */
describe("Property 14: Top-k ranking invariant", () => {
  it("returns min(k, candidates.length) items, sorted by finalScore desc, rank starting at 1", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            chunkId: fc.string({ minLength: 1 }),
            score: fc.float({ min: 0, max: 1, noNaN: true }),
          }),
          { minLength: 0, maxLength: 20 },
        ),
        fc.integer({ min: 1, max: 10 }),
        (rawCandidates, k) => {
          const candidates: RetrievalCandidate[] = rawCandidates.map((c) => ({
            chunkId: c.chunkId,
            text: `text-${c.chunkId}`,
            sourceId: "src",
            score: c.score,
          }));

          const result = rankCandidates(candidates, k);

          // 1. Length must be min(k, candidates.length)
          const expectedLength = Math.min(k, candidates.length);
          if (result.length !== expectedLength) return false;

          // 2. Results must be sorted by finalScore descending
          for (let i = 0; i < result.length - 1; i++) {
            if (result[i]!.finalScore < result[i + 1]!.finalScore) return false;
          }

          // 3. Rank values start at 1 and increment by 1
          for (let i = 0; i < result.length; i++) {
            if (result[i]!.rank !== i + 1) return false;
          }

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
