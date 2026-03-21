export interface EmbeddingAdapter {
  embed(texts: string[]): Promise<number[][]>;
  modelId: string;
  dimensions: number;
}

/**
 * Simple deterministic hash of a string → integer.
 * Used to seed the mock vector so the same text always produces the same vector.
 */
function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (Math.imul(h, 0x01000193) >>> 0);
  }
  return h;
}

/**
 * Seeded pseudo-random number generator (xorshift32).
 * Returns a float in [-1, 1].
 */
function seededFloat(seed: number, index: number): number {
  let s = (seed ^ (index * 2654435761)) >>> 0;
  s ^= s << 13;
  s ^= s >> 17;
  s ^= s << 5;
  s = s >>> 0;
  // Map [0, 2^32) → [-1, 1]
  return (s / 0xffffffff) * 2 - 1;
}

/**
 * Mock embedding adapter.
 *
 * Returns deterministic fixture vectors derived from a hash of the input text.
 * The same text always produces the same vector, making tests reproducible.
 */
export const mockEmbeddingAdapter: EmbeddingAdapter = {
  modelId: "mock-v1",
  dimensions: 384,

  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) => {
      const seed = hashString(text);
      return Array.from({ length: 384 }, (_, i) => seededFloat(seed, i));
    });
  },
};
