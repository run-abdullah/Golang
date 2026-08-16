import { createMemo } from "solid-js";
import { marked } from "marked";

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer(props: MarkdownViewerProps) {
  const html = createMemo(() => {
    let rawContent = props.content;

    // 1. Obsidian WikiLinks [[Link]]
    rawContent = rawContent.replace(
      /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
      (_, link, text) =>
        `<a href="#" class="obsidian-link">📄 ${text || link}</a>`,
    );

    // 2. Obsidian Text Highlights ==text==
    rawContent = rawContent.replace(
      /==([^=]+)==/g,
      '<mark class="bg-[#a3e635]/20 text-[#a3e635] px-1.5 py-0.5 rounded border border-[#a3e635]/30">$1</mark>',
    );

    // 3. Obsidian Callouts
    rawContent = rawContent.replace(
      /^>\s*\[!([A-Z]+)\]\s*(.*)$/gm,
      (_, type, title) => {
        const calloutType = type.toLowerCase();
        return `> **[${calloutType.toUpperCase()}]** ${title}`;
      },
    );

    // Synchronous parsing forcing explicit string type
    return marked.parse(rawContent, {
      async: false,
      gfm: true,
      breaks: true,
    }) as string;
  });

  return (
    <div class="rounded-2xl border border-zinc-800/80 bg-[#121215] p-6 sm:p-12 shadow-2xl">
      <article
        class="prose prose-invert max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-100
          prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:border-b prose-h1:border-zinc-800 prose-h1:pb-4 prose-h1:text-[#a3e635]
          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:border-b prose-h2:border-zinc-800/50 prose-h2:pb-2
          prose-p:text-zinc-300 prose-p:leading-relaxed 
          prose-code:rounded-md prose-code:bg-zinc-900 prose-code:px-2 prose-code:py-0.5 prose-code:text-[#a3e635] prose-code:before:content-none prose-code:after:content-none
          prose-ul:list-disc prose-ul:text-zinc-300 prose-ol:text-zinc-300"
        innerHTML={html()}
      />
    </div>
  );
}
