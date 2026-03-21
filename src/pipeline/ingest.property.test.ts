// Feature: dblxl-live-demo, Property 12: Ingestion produces chunks

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { chunkText } from "./chunk.js";

/**
 * Validates: Requirements 4.1
 *
 * Property 12: For any non-empty markdown or plain-text string, ingestion
 * produces ≥1 DocumentChunk with non-empty text and valid chunkId.
 */
describe("Property 12: Ingestion produces chunks", () => {
  it("non-empty string produces ≥1 chunk with non-empty text and valid chunkId", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (content) => {
          const sourceId = "test-source";
          const chunks = chunkText(content, sourceId, { chunkSize: 50, overlap: 10 });

          // Must produce at least one chunk
          expect(chunks.length).toBeGreaterThanOrEqual(1);

          for (const chunk of chunks) {
            // Each chunk must have non-empty text
            expect(chunk.text.length).toBeGreaterThan(0);

            // Each chunk must have a valid (non-empty) chunkId
            expect(chunk.chunkId.length).toBeGreaterThan(0);

            // chunkId must follow the expected format
            expect(chunk.chunkId).toMatch(/^.+-chunk-\d+$/);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
