import type { ContextBlock } from "@/types/tool";

const SPLIT_PATTERN = /\n## \d+\.\s.*?\n/;

export function splitContextMd(contextMd: string): ContextBlock[] {
  // Prepend newline so the first heading is captured by the split pattern
  const prepared = "\n" + contextMd;
  const blocks = prepared.split(SPLIT_PATTERN);

  // blocks[0] is the document header — skip it
  // blocks[1..5] map to context_index 1..5
  const result: ContextBlock[] = [];

  for (let i = 1; i <= Math.min(blocks.length - 1, 5); i++) {
    const raw = blocks[i].trim();
    const lines = raw.split("\n");
    const title = lines[0]?.replace(/^#+\s*/, "").trim() || `Context ${i}`;
    const content = lines.slice(1).join("\n").trim();

    result.push({
      context_index: i as 1 | 2 | 3 | 4 | 5,
      content,
      title,
    });
  }

  return result;
}
