// Feature: dblxl-live-demo, Property 15: Retrieval trace completeness

import { describe, it } from "vitest";
import * as fc from "fast-check";
import { buildTrace } from "./trace.js";

/**
 * Validates: Requirements 4.5
 *
 * Property 15: For any query string, resulting RetrievalTrace contains
 * original query text, non-empty traceId, results array, and non-negative
 * totalLatencyMs + embeddingLatencyMs.
 */
describe("Property 15: Retrieval trace completeness", () => {
  it("trace contains original query, non-empty traceId, results array, and non-negative latencies", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.nat(),
        fc.nat(),
        (query, totalLatencyMs, embeddingLatencyMs) => {
          const trace = buildTrace(query, [], totalLatencyMs, embeddingLatencyMs);

          // 1. query must equal the original query string
          if (trace.query !== query) return false;

          // 2. traceId must be non-empty
          if (!trace.traceId || trace.traceId.length === 0) return false;

          // 3. results must be an array
          if (!Array.isArray(trace.results)) return false;

          // 4. totalLatencyMs must be non-negative
          if (trace.totalLatencyMs < 0) return false;

          // 5. embeddingLatencyMs must be non-negative
          if (trace.embeddingLatencyMs < 0) return false;

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
