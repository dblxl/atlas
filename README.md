# Atlas

![Status](https://img.shields.io/badge/status-reference--scaffold-1a1a1a?style=flat&labelColor=000000&color=262626)
![License](https://img.shields.io/badge/license-MIT-1a1a1a?style=flat&labelColor=000000&color=262626)

**A reference architecture for RAG (Retrieval-Augmented Generation) that makes it easy to see exactly why your AI answered the way it did, step-by-step.**

## Observable RAG Reference Architecture

A practical reference for retrieval systems that must be measurable, maintainable, and cost-aware. 

**What is RAG?** RAG stands for Retrieval-Augmented Generation. It's the process of giving an AI model context from your private data (like documents or databases) so it can answer questions accurately instead of guessing.

## When to use this

Use this when you are building an AI app that searches your data, and you are struggling with the AI saying "I don't know" or giving bad answers, and you can't figure out *why*. Instead of a black box, Atlas helps you see exactly which step failed: Did it miss the document? Did it score it too low? Did the AI ignore it?

## Why This Exists

Retrieval systems usually fail at the operational layer, not the demo layer. Quality drops become hard to diagnose when ingestion, indexing, scoring, and response assembly are treated as a single black box.

Atlas separates those concerns so teams can inspect behavior, compare strategies, and improve quality without rewriting the entire system. The goal is not novelty. The goal is a retrieval stack that can be operated with confidence.

Atlas is built for resourceful teams that need clear retrieval architecture without building a large internal platform. The structure reflects delivery work where observability and cost control matter as much as answer quality.

## Core Principles

- Keep ingestion deterministic.
- Make retrieval scoring inspectable.
- Measure quality continuously.
- Isolate layers so iteration stays controlled.
- Optimize for operational clarity and cost discipline.

## Architecture Overview

Atlas defines five layers. Think of this like a physical library:

1. **Source Ingestion** (Acquiring new books)
2. **Chunking & Embedding** (Reading and summarizing chapters)
3. **Index & Storage** (The card catalog system)
4. **Retrieval & Ranking** (Finding the best books for a patron's question)
5. **Response Evaluation** (The librarian ensuring the chosen books actually answer the patron's question)

Each layer emits logs and metrics so failures can be traced to a specific decision point.

```mermaid
graph TD
    A[Source Ingestion] --> B[Chunking & Embedding]
    B --> C[(Index & Vector Storage)]
    C --> D[Retrieval & Ranking]
    D --> E[Response Evaluation]
```

## Quickstart

Right now, Atlas is a reference structure. A typical flow starts with initializing the workspace:
```bash
# Example scaffolding command (coming soon)
npx @doublexl/atlas init
```

## Tech Stack (Initial)

- TypeScript for future adapters and validation scripts.
- Astro-compatible documentation structure.
- TailwindCSS and CSS variables reserved for later docs UI.
- **Edge-friendly assumptions**: Designed to run fast and cheap on modern edge networks like Cloudflare Workers or Vercel Edge.

## Roadmap

See [ROADMAP.md](./ROADMAP.md).

## Attribution

Published by DoubleXL  
https://www.double-xl.com
