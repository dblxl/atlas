# Embedding Models for Retrieval

An embedding model converts text into a dense numerical vector that captures semantic meaning. Two texts with similar meanings produce vectors that are close together in the embedding space, enabling similarity search over large corpora.

## How Embeddings Work

The model processes a text sequence through a transformer encoder and pools the token representations into a single fixed-length vector. The dimensionality of this vector — commonly 384, 768, or 1536 dimensions — determines the expressiveness of the representation and the storage cost per chunk.

## Popular Models

- **text-embedding-ada-002** (OpenAI): 1536 dimensions, strong general-purpose performance, available via API.
- **text-embedding-3-small** (OpenAI): 1536 dimensions, lower cost than ada-002 with comparable quality.
- **all-MiniLM-L6-v2** (Sentence Transformers): 384 dimensions, fast, runs locally, good for English text.
- **e5-large-v2** (Microsoft): 1024 dimensions, strong multilingual and cross-lingual retrieval.
- **nomic-embed-text** (Nomic): 768 dimensions, open weights, competitive with proprietary models.

## Choosing Dimensions

Higher dimensions capture more nuance but increase storage and query latency. For most RAG applications, 768 dimensions offers a good balance. If latency is critical, 384-dimensional models with quantized vectors can reduce query time significantly.

## Batch Embedding

Embedding large corpora one chunk at a time is slow. Most providers support batch requests of 100–2048 texts. Batching reduces API round-trips and lowers cost per token.

## Provider Adapter Pattern

Wrapping the embedding call behind a stable interface allows swapping providers without changing pipeline code. The adapter exposes `embed(texts: string[]): Promise<number[][]>` and a `dimensions` property.
