// Feature: dblxl-live-demo, Property 16: Evaluation metrics in valid range

import { describe, it } from "vitest";
import * as fc from "fast-check";
import { computeMetrics } from "./metrics.js";
import type { EvalPair } from "./metrics.js";
import type { RankedResult } from "../retrieval/rank.js";

/**
 * Validates: Requirements 4.6
 *
 * Property 16: For any Evaluation_Set, EvalResult has recallAt5 in [0,1],
 * mrr in [0,1], and queryCount equal to the number of pairs.
 */
describe("Property 16: Evaluation metrics in valid range", () => {
  it("recallAt5 in [0,1], mrr in [0,1], queryCount === pairs.length", () => {
    fc.assert(
      fc.property(
        // Generate evaluation pairs
        fc.array(
          fc.record({
            query: fc.string({ minLength: 1 }),
            expectedChunkId: fc.string({ minLength: 1 }),
          }),
          { minLength: 1, maxLength: 20 },
        ),
        // Generate a seed to deterministically vary retrieval results
        fc.integer({ min: 0, max: 999 }),
        (rawPairs, seed) => {
          const pairs: EvalPair[] = rawPairs;

          // Build mock retrieval results for each query.
          // Vary whether the expected chunk appears in results based on seed.
          const results = new Map<string, RankedResult[]>();

          for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i]!;
            const includeMatch = (seed + i) % 3 !== 0; // ~2/3 of queries get a hit

            const ranked: RankedResult[] = [];

            if (includeMatch) {
              ranked.push({
                chunkId: pair.expectedChunkId,
                text: `text for ${pair.expectedChunkId}`,
                sourceId: "mock-source",
                finalScore: 0.9,
                rank: 1,
              });
            }

            // Pad with non-matching results up to 5
            for (let j = ranked.length; j < 5; j++) {
              ranked.push({
                chunkId: `other-chunk-${i}-${j}`,
                text: `other text ${j}`,
                sourceId: "mock-source",
                finalScore: 0.5 - j * 0.05,
                rank: j + 1,
              });
            }

            results.set(pair.query, ranked);
          }

          const result = computeMetrics(pairs, results);

          // recallAt5 must be in [0, 1]
          if (result.recallAt5 < 0 || result.recallAt5 > 1) return false;

          // mrr must be in [0, 1]
          if (result.mrr < 0 || result.mrr > 1) return false;

          // queryCount must equal number of pairs
          if (result.queryCount !== pairs.length) return false;

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
