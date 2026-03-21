import { describe, it, expect } from "vitest";
import { chunkText } from "./chunk.js";

describe("chunkText", () => {
  it("returns [] for empty string", () => {
    expect(chunkText("", "doc", { chunkSize: 5, overlap: 1 })).toEqual([]);
  });

  it("returns [] for whitespace-only string", () => {
    expect(chunkText("   \n\t  ", "doc", { chunkSize: 5, overlap: 1 })).toEqual([]);
  });

  it("returns a single chunk when text is shorter than chunkSize", () => {
    const result = chunkText("hello world", "doc", { chunkSize: 10, overlap: 2 });
    expect(result).toHaveLength(1);
    expect(result[0]?.text).toBe("hello world");
  });

  it("returns a single chunk when text is exactly chunkSize words", () => {
    const words = Array.from({ length: 5 }, (_, i) => `word${i}`).join(" ");
    const result = chunkText(words, "doc", { chunkSize: 5, overlap: 1 });
    expect(result).toHaveLength(1);
    expect(result[0]?.text).toBe(words);
  });

  it("returns multiple chunks with correct overlap when text exceeds chunkSize", () => {
    // 10 words, chunkSize=4, overlap=2 → step=2
    // chunk 0: words 0-3, chunk 1: words 2-5, chunk 2: words 4-7, chunk 3: words 6-9
    const words = Array.from({ length: 10 }, (_, i) => `w${i}`);
    const result = chunkText(words.join(" "), "src", { chunkSize: 4, overlap: 2 });

    expect(result.length).toBeGreaterThan(1);

    // Verify overlap: last 2 words of chunk N == first 2 words of chunk N+1
    for (let i = 0; i < result.length - 1; i++) {
      const curr = result[i]!.text.split(" ");
      const next = result[i + 1]!.text.split(" ");
      const overlapWords = curr.slice(-2);
      const nextStart = next.slice(0, 2);
      expect(overlapWords).toEqual(nextStart);
    }
  });

  it("chunkId format is `${sourceId}-chunk-${index}`", () => {
    const result = chunkText("a b c d e f g h", "my-source", { chunkSize: 3, overlap: 1 });
    result.forEach((chunk, i) => {
      expect(chunk.chunkId).toBe(`my-source-chunk-${i}`);
    });
  });

  it("chunkIndex matches array position", () => {
    const result = chunkText("a b c d e f g h i j", "src", { chunkSize: 3, overlap: 1 });
    result.forEach((chunk, i) => {
      expect(chunk.chunkIndex).toBe(i);
    });
  });

  it("single-token document produces one chunk", () => {
    const result = chunkText("hello", "doc", { chunkSize: 5, overlap: 2 });
    expect(result).toHaveLength(1);
    expect(result[0]?.text).toBe("hello");
    expect(result[0]?.chunkId).toBe("doc-chunk-0");
    expect(result[0]?.chunkIndex).toBe(0);
  });
});
