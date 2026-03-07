export type RetrievalEventName =
  | "ingestion.completed"
  | "chunking.completed"
  | "embedding.completed"
  | "retrieval.executed"
  | "evaluation.recorded";

export interface RetrievalEvent {
  eventName: RetrievalEventName;
  latencyMs: number;
  recordedAt: string;
  status: "ok" | "warning" | "error";
  traceId: string;
}

export interface EvaluationMetric {
  name: "recall_at_5" | "mrr" | "latency_ms";
  value: number;
}

export function summarizeMetrics(metrics: EvaluationMetric[]): string {
  return metrics.map((metric) => `${metric.name}=${metric.value}`).join(", ");
}

export const baselineRetrievalEvents: RetrievalEvent[] = [
  {
    eventName: "retrieval.executed",
    latencyMs: 132,
    recordedAt: "2026-03-06T12:01:00Z",
    status: "ok",
    traceId: "trace_001",
  },
  {
    eventName: "evaluation.recorded",
    latencyMs: 18,
    recordedAt: "2026-03-06T12:01:01Z",
    status: "ok",
    traceId: "trace_001",
  },
];
