# Phase 1 - Foundation

- Publish core architecture modules and terminology.
- Add retrieval flow and chunking reference documents.
- Define baseline observability events.

# Phase 2 - Implementation

- Add reference interfaces for ingestion and retrieval modules.
- Provide scoring and ranking pseudocode templates.
- Define dataset formats for retrieval evaluation.

# Phase 3 - Observability

- Add dashboards for retrieval latency, recall, and error rates.
- Track quality trends by query class.
- Document incident review workflows for retrieval regressions.

# Phase 4 - Hardening

- Add schema versioning for chunks and embeddings.
- Define rollback strategy for index refreshes.
- Add reliability and load-test guidance.

# Phase 5 - Extensibility

- Add hybrid retrieval patterns.
- Add adapter examples for multiple vector stores.
- Define plugin points for custom rerankers.

# What Will Not Be Built

- An end-user application UI.
- Proprietary model tuning workflows.
- One-click deployment automation in v0.

# Scope Boundaries

Atlas defines retrieval architecture and observability patterns. It does not prescribe a single model provider or application layer.
