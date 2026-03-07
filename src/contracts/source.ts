export type SourceKind = "cms" | "docs" | "ticketing" | "file-store";

export interface SourceDocument {
  checksum: string;
  id: string;
  kind: SourceKind;
  title: string;
  updatedAt: string;
  uri: string;
}

export interface IngestionBatch {
  batchId: string;
  documents: SourceDocument[];
  startedAt: string;
}

export function stableDocumentKey(document: SourceDocument): string {
  return `${document.kind}:${document.id}:${document.checksum}`;
}

export const exampleIngestionBatch: IngestionBatch = {
  batchId: "ingest_2026_03_06_001",
  startedAt: "2026-03-06T12:00:00Z",
  documents: [
    {
      id: "kb_321",
      kind: "docs",
      title: "On-call runbook",
      uri: "https://docs.example.test/on-call/runbook",
      checksum: "sha256:abc123",
      updatedAt: "2026-03-05T18:42:00Z",
    },
  ],
};
