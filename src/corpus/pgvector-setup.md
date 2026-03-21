# Setting Up pgvector in PostgreSQL

pgvector is a PostgreSQL extension that adds a native vector data type and similarity search operators. It enables storing and querying embedding vectors directly in a relational database, eliminating the need for a separate vector store.

## Installation

On most Linux distributions, install the extension package matching your PostgreSQL version:

```bash
sudo apt install postgresql-16-pgvector
```

On macOS with Homebrew:

```bash
brew install pgvector
```

After installation, enable the extension in your target database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Creating a Vector Column

Define a table with a `vector` column specifying the number of dimensions:

```sql
CREATE TABLE document_chunks (
  id          TEXT PRIMARY KEY,
  source_id   TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content     TEXT NOT NULL,
  embedding   vector(1536)
);
```

## Inserting Embeddings

Insert a row with an embedding array cast to the `vector` type:

```sql
INSERT INTO document_chunks (id, source_id, chunk_index, content, embedding)
VALUES ($1, $2, $3, $4, $5::vector);
```

## Similarity Search

Use the `<=>` cosine distance operator to find the nearest neighbors:

```sql
SELECT id, content, 1 - (embedding <=> $1::vector) AS score
FROM document_chunks
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

## Indexing for Performance

For large tables, create an HNSW index to speed up approximate nearest-neighbor search:

```sql
CREATE INDEX ON document_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

## Verifying the Extension

Check that pgvector is active before running any vector operations:

```sql
SELECT 1 FROM pg_extension WHERE extname = 'vector';
```

If this query returns no rows, emit a descriptive error and exit before attempting any writes.
