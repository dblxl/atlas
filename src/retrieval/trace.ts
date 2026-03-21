import type { RankedResult } from "./rank.js";

export interface RetrievalTrace {
  traceId: string;
  query: string;
  results: RankedResult[];
  totalLatencyMs: number;
  embeddingLatencyMs: number;
}

/**
 * FNV-1a 32-bit hash of a string → unsigned integer.
 * Deterministic across runs — used to make traceId reproducible for the
 * same query within a single millisecond (useful in tests).
 */
function fnv1a32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (Math.imul(h, 0x01000193) >>> 0);
  }
  return h >>> 0;
}

/**
 * Build a `RetrievalTrace` from query results and timing information.
 *
 * `traceId` format: `trace_<timestampMs>_<queryHash8hex>`
 * — timestamp prefix ensures uniqueness across calls;
 * — query hash makes the ID reproducible for the same query in the same ms.
 */
export function buildTrace(
  query: string,
  results: RankedResult[],
  totalLatencyMs: number,
  embeddingLatencyMs: number,
): RetrievalTrace {
  const ts = Date.now();
  const hash = fnv1a32(query).toString(16).padStart(8, "0");
  const traceId = `trace_${ts}_${hash}`;

  return { traceId, query, results, totalLatencyMs, embeddingLatencyMs };
}
