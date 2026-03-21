// Feature: dblxl-live-demo, Property 13: Chunking coverage invariant

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { chunkText } from "./chunk.js";
import type { ChunkConfig } from "./chunk.js";

/**
 * Validates: Requirements 4.2
 *
 * Property 13: For any document string and ChunkConfig, the concatenation of
 * all produced chunk texts (ignoring overlap) covers every token in the
 * original document — no content is silently dropped. Additionally, for any
 * two adjacent chunks, the overlap between the end of chunk N and the start
 * of chunk N+1 must equal the configured overlap value (or the remaining
 * document length if shorter).
 *
 * Token definition: chunk.ts splits by /\s+/ and filters empty strings,
 * so a "token" is a whitespace-delimited word.
 */
describe("Property 13: Chunking coverage invariant", () => {
  it("all tokens from the original document appear in at least one chunk", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        fc
          .record({
            chunkSize: fc.integer({ min: 5, max: 100 }),
            overlap: fc.integer({ min: 0, max: 20 }),
          })
          .filter((c) => c.overlap < c.chunkSize),
        (doc, config: ChunkConfig) => {
          const sourceId = "test-source";
          const chunks = chunkText(doc, sourceId, config);

          // Tokenise the same way chunk.ts does
          const originalTokens = doc.split(/\s+/).filter((w) => w.length > 0);

          // Every chunk must have non-empty text
          for (const chunk of chunks) {
            expect(chunk.text.length).toBeGreaterThan(0);
          }

          // Collect all tokens that appear in any chunk
          const coveredTokens = new Set<string>();
          for (const chunk of chunks) {
            const chunkTokens = chunk.text.split(/\s+/).filter((w) => w.length > 0);
            for (const token of chunkTokens) {
              coveredTokens.add(token);
            }
          }

          // Every original token must appear in at least one chunk
          for (const token of originalTokens) {
            expect(coveredTokens.has(token)).toBe(true);
          }

          // Verify the union of chunk token arrays (de-overlapped) covers all
          // original tokens in order. We reconstruct the full token sequence by
          // taking the non-overlapping portion of each chunk.
          if (chunks.length > 0) {
            const step = Math.max(1, config.chunkSize - config.overlap);
            const reconstructed: string[] = [];

            for (let i = 0; i < chunks.length; i++) {
              const chunkTokens = chunks[i]!.text.split(/\s+/).filter((w) => w.length > 0);
              if (i === 0) {
                // First chunk: take all tokens
                reconstructed.push(...chunkTokens);
              } else {
                // Subsequent chunks: skip the overlapping prefix
                const skipCount = Math.min(config.overlap, chunkTokens.length);
                reconstructed.push(...chunkTokens.slice(skipCount));
              }
            }

            // The reconstructed sequence must equal the original token sequence
            expect(reconstructed).toEqual(originalTokens);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("adjacent chunk overlap equals configured overlap (or remaining length if shorter)", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        fc
          .record({
            chunkSize: fc.integer({ min: 5, max: 100 }),
            overlap: fc.integer({ min: 1, max: 20 }),
          })
          .filter((c) => c.overlap < c.chunkSize),
        (doc, config: ChunkConfig) => {
          const sourceId = "test-source";
          const chunks = chunkText(doc, sourceId, config);

          for (let i = 0; i < chunks.length - 1; i++) {
            const currTokens = chunks[i]!.text.split(/\s+/).filter((w) => w.length > 0);
            const nextTokens = chunks[i + 1]!.text.split(/\s+/).filter((w) => w.length > 0);

            // The expected overlap is min(config.overlap, currTokens.length, nextTokens.length)
            const expectedOverlap = Math.min(config.overlap, currTokens.length, nextTokens.length);

            // Last `expectedOverlap` tokens of chunk N must equal first `expectedOverlap` tokens of chunk N+1
            const tailOfCurr = currTokens.slice(-expectedOverlap);
            const headOfNext = nextTokens.slice(0, expectedOverlap);

            expect(tailOfCurr).toEqual(headOfNext);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
