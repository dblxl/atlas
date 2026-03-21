import type { DocumentChunk } from "./chunk.js";

export interface VectorStore {
  /** Write chunks and their corresponding embedding vectors. */
  write(chunks: DocumentChunk[], embeddings: number[][]): Promise<void>;
  /**
   * Probe the store to verify it is available and correctly configured.
   * Throws (or exits) if the store is unavailable.
   */
  probe(): Promise<void>;
}

// ---------------------------------------------------------------------------
// Mock store — in-memory, suitable for tests and local demos
// ---------------------------------------------------------------------------

interface StoredEntry {
  chunk: DocumentChunk;
  embedding: number[];
}

/**
 * In-memory vector store.  The default store used in demo and test contexts.
 */
export function createMockVectorStore(): VectorStore & {
  entries: Map<string, StoredEntry>;
} {
  const entries = new Map<string, StoredEntry>();

  return {
    entries,

    async probe(): Promise<void> {
      // Always available — nothing to probe.
    },

    async write(chunks: DocumentChunk[], embeddings: number[][]): Promise<void> {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = embeddings[i];
        if (chunk && embedding) {
          entries.set(chunk.chunkId, { chunk, embedding });
        }
      }
    },
  };
}

/** Singleton mock store exported for convenience. */
export const mockVectorStore: VectorStore = createMockVectorStore();

// ---------------------------------------------------------------------------
// pgvector store — requires a live PostgreSQL instance with pgvector enabled
// ---------------------------------------------------------------------------

/**
 * Create a pgvector-backed vector store.
 *
 * On `probe()`, the store runs:
 *   SELECT 1 FROM pg_extension WHERE extname = 'vector'
 * If the extension is absent, it emits a descriptive error to stderr and
 * calls `process.exit(1)` so the process terminates cleanly without
 * corrupting any data.
 *
 * @param connectionString  PostgreSQL connection string, e.g.
 *   "postgresql://user:pass@localhost:5432/mydb"
 */
export function createPgVectorStore(connectionString: string): VectorStore {
  return {
    async probe(): Promise<void> {
      // Dynamically import `pg` so that the module can be loaded in
      // environments where pg is not installed (e.g. pure demo mode).
      let client: {
        connect(): Promise<void>;
        query(sql: string): Promise<{ rows: unknown[] }>;
        end(): Promise<void>;
      };

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { default: pg } = await import("pg" as any);
        client = new pg.Client({ connectionString });
      } catch {
        process.stderr.write(
          "[atlas] ERROR: The 'pg' package is not installed. " +
            "Run `pnpm add pg` in atlas/ to enable the pgvector store.\n",
        );
        process.exit(1);
      }

      try {
        await client.connect();
        const result = await client.query(
          "SELECT 1 FROM pg_extension WHERE extname = 'vector'",
        );
        if (result.rows.length === 0) {
          process.stderr.write(
            "[atlas] ERROR: The pgvector extension is not installed in the " +
              "target PostgreSQL database. " +
              "Run `CREATE EXTENSION IF NOT EXISTS vector;` as a superuser, " +
              "then retry.\n",
          );
          await client.end();
          process.exit(1);
        }
        await client.end();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        process.stderr.write(
          `[atlas] ERROR: Failed to connect to PostgreSQL or probe pgvector: ${message}\n`,
        );
        process.exit(1);
      }
    },

    async write(chunks: DocumentChunk[], embeddings: number[][]): Promise<void> {
      // Full pgvector write implementation would use parameterised INSERT
      // statements with the pgvector `vector` type.  For the demo scaffold
      // this is intentionally left as a stub — call probe() first to verify
      // the extension is available before wiring up real writes.
      void chunks;
      void embeddings;
      void connectionString;
      throw new Error(
        "[atlas] pgVectorStore.write() is not yet implemented. " +
          "Use mockVectorStore for local demos.",
      );
    },
  };
}
