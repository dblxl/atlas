import { readFile } from "fs/promises";
import { extname } from "path";

export type MimeType = "text/markdown" | "text/plain";

export interface IngestedFile {
  sourceId: string;
  text: string;
  mimeType: MimeType;
}

/**
 * Read a file from disk and return its content with detected MIME type.
 * Markdown files (.md, .mdx) are typed as "text/markdown"; everything else
 * is "text/plain".
 */
export async function ingestFile(filePath: string): Promise<IngestedFile> {
  const text = await readFile(filePath, "utf-8");
  const ext = extname(filePath).toLowerCase();
  const mimeType: MimeType =
    ext === ".md" || ext === ".mdx" ? "text/markdown" : "text/plain";

  // Use the basename (without leading path) as the sourceId so it is
  // stable and human-readable.
  const sourceId = filePath.replace(/\\/g, "/").split("/").pop() ?? filePath;

  return { sourceId, text, mimeType };
}
