# Retrieval-Augmented Generation

Retrieval-augmented generation (RAG) is an architecture that combines a large language model with an external knowledge retrieval system. Instead of relying solely on the model's parametric memory, RAG fetches relevant documents at inference time and injects them into the prompt as context.

## How RAG Works

A RAG pipeline has two main phases: indexing and retrieval. During indexing, source documents are chunked into smaller passages, converted into dense vector embeddings, and stored in a vector database. At query time, the user's question is embedded using the same model, and the nearest-neighbor search returns the most semantically similar passages.

Those retrieved passages are prepended to the prompt as context, allowing the language model to ground its answer in factual, up-to-date information rather than hallucinating from training data alone.

## Key Benefits

- **Reduced hallucination**: The model answers from retrieved evidence rather than memorized patterns.
- **Updatable knowledge**: The vector store can be refreshed without retraining the model.
- **Source attribution**: Retrieved chunks carry metadata (source file, page, section) that can be surfaced to the user.
- **Cost efficiency**: Smaller, cheaper models can perform well when given precise context.

## Common Use Cases

RAG is widely used for enterprise Q&A over internal documentation, customer support bots, legal research assistants, and code search tools. Any domain where accuracy and freshness matter more than creative generation is a strong candidate for a RAG architecture.
