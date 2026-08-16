import { createResource, createEffect, onCleanup } from "solid-js";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface Props {
  content: string;
}

export default function MarkdownViewer(props: Props) {
  let articleRef: HTMLElement | undefined;

  // Pre-process Obsidian syntax
  const preprocessObsidian = (text: string) => {
    if (!text) return "";

    let processed = text;

    // 1. Highlights ==text==
    processed = processed.replace(
      /==([^=]+)==/g,
      '<mark class="obsidian-highlight">$1</mark>',
    );

    // 2. Callouts [!NOTE], [!WARNING], etc.
    processed = processed.replace(
      /^>\s*\[!([A-Za-z]+)\]([+-]?)\s*(.*)$/gm,
      (match, type, fold, title) => {
        const calloutType = type.toLowerCase();
        const calloutTitle =
          title || type.charAt(0).toUpperCase() + type.slice(1);
        const isFoldable = fold === "+" || fold === "-";
        const isFolded = fold === "-";

        return `<div class="obsidian-callout callout-${calloutType} ${
          isFoldable ? "is-foldable" : ""
        } ${isFolded ? "is-folded" : ""}">
          <div class="callout-title">
            <span class="callout-icon">${getCalloutIcon(calloutType)}</span>
            <span>${calloutTitle}</span>
            ${isFoldable ? '<span class="callout-fold">▼</span>' : ""}
          </div>
          <div class="callout-content">`;
      },
    );

    // Close callouts before headings or code blocks
    processed = processed.replace(
      /(<div class="obsidian-callout[\s\S]*?)(?=\n#{1,6}\s|\n```|$)/g,
      "$1</div></div>\n",
    );

    // 3. Wiki Links [[Note]] and [[Note|Alias]]
    processed = processed.replace(
      /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
      (match, target, alias) => {
        const linkText = alias || target;
        return `<a href="#${target.toLowerCase().replace(/\s+/g, "-")}" class="obsidian-link internal-link" data-target="${target}">${linkText}</a>`;
      },
    );

    // 4. Embeds ![[Note]]
    processed = processed.replace(
      /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
      (match, target, alias) => {
        return `<div class="obsidian-embed" data-embed="${target}">
          <div class="embed-title">📄 ${alias || target}</div>
          <div class="embed-content">Embedded note: ${target}</div>
        </div>`;
      },
    );

    // 5. Tags #tag
    processed = processed.replace(
      /(^|\s)#([a-zA-Z0-9_-]+)/g,
      '$1<a href="#tag-$2" class="obsidian-tag">#$2</a>',
    );

    // 6. Footnotes [^1]
    processed = processed.replace(
      /\[\^([^\]]+)\]/g,
      '<sup class="footnote-ref"><a href="#fn-$1">$1</a></sup>',
    );

    // 7. Task lists
    processed = processed.replace(
      /^(\s*)- \[ \] (.*)$/gm,
      '$1<label class="task-list-item"><input type="checkbox" class="task-list-item-checkbox"><span>$2</span></label>',
    );
    processed = processed.replace(
      /^(\s*)- \[x\] (.*)$/gm,
      '$1<label class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" checked><span>$2</span></label>',
    );

    return processed;
  };

  // Get callout icons
  const getCalloutIcon = (type: string) => {
    const icons: Record<string, string> = {
      note: "📝",
      warning: "⚠️",
      danger: "🚨",
      error: "❌",
      tip: "💡",
      info: "ℹ️",
      success: "✅",
      question: "❓",
      example: "📚",
      quote: "💬",
      abstract: "📋",
      todo: "☑️",
      bug: "🐛",
      important: "⭐",
    };
    return icons[type] || "📌";
  };

  // ✅ FIX: Create marked instance ONCE, not every time
  const markedInstance = marked;

  // Configure marked with highlight ONLY ONCE
  markedInstance.use(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error("Highlight error:", err);
          }
        }
        try {
          return hljs.highlightAuto(code).value;
        } catch (err) {
          return code;
        }
      },
    }),
  );

  markedInstance.setOptions({
    gfm: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    smartypants: true,
  });

  // Parse markdown to HTML
  const [htmlContent] = createResource(
    () => props.content,
    async (rawMarkdown) => {
      const prepared = preprocessObsidian(rawMarkdown);

      // ✅ FIX: Use marked.parse() - it returns string directly
      let html = markedInstance.parse(prepared) as string;

      // ✅ FIX: Don't double-process code blocks
      // The HTML is already correct from marked
      // Just add copy button wrappers
      html = html.replace(
        /<pre><code class="hljs language-([^"]+)">/g,
        '<div class="code-block-wrapper"><div class="code-language">$1</div><pre><code class="hljs language-$1">',
      );
      html = html.replace(
        /<\/code><\/pre>/g,
        '</code></pre><button class="copy-code-button" onclick="window.copyCode(this)">Copy</button></div>',
      );

      // For code blocks without language
      html = html.replace(
        /<pre><code class="hljs">/g,
        '<div class="code-block-wrapper"><div class="code-language">code</div><pre><code class="hljs">',
      );

      return html;
    },
  );

  // Setup global copy function
  createEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).copyCode = async (button: HTMLElement) => {
        const wrapper = button.parentElement;
        const code = wrapper?.querySelector("code");

        if (code) {
          const text = code.textContent || "";

          try {
            await navigator.clipboard.writeText(text);
            button.textContent = "Copied!";
            button.classList.add("copied");

            setTimeout(() => {
              button.textContent = "Copy";
              button.classList.remove("copied");
            }, 2000);
          } catch (err) {
            // Fallback
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();

            try {
              document.execCommand("copy");
              button.textContent = "Copied!";
              button.classList.add("copied");

              setTimeout(() => {
                button.textContent = "Copy";
                button.classList.remove("copied");
              }, 2000);
            } catch (fallbackErr) {
              console.error("Copy failed:", fallbackErr);
            }

            document.body.removeChild(textarea);
          }
        }
      };
    }
  });

  // Add event listeners for interactive elements
  createEffect(() => {
    if (htmlContent() && articleRef) {
      // Handle task list checkboxes
      const checkboxes = articleRef.querySelectorAll(
        ".task-list-item-checkbox",
      );
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
          const target = e.target as HTMLInputElement;
          const span = target.nextElementSibling;
          if (span) {
            if (target.checked) {
              span.classList.add("task-completed");
            } else {
              span.classList.remove("task-completed");
            }
          }
        });
      });

      // Handle foldable callouts
      const foldButtons = articleRef.querySelectorAll(".callout-fold");
      foldButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const callout = btn.closest(".obsidian-callout");
          if (callout) {
            callout.classList.toggle("is-folded");
          }
        });
      });

      // Style already checked task lists
      const checkedBoxes = articleRef.querySelectorAll(
        ".task-list-item-checkbox:checked",
      );
      checkedBoxes.forEach((checkbox) => {
        const span = checkbox.nextElementSibling;
        if (span) {
          span.classList.add("task-completed");
        }
      });
    }
  });

  // Cleanup
  onCleanup(() => {
    if (typeof window !== "undefined") {
      delete (window as any).copyCode;
    }
  });

  return (
    <div class="markdown-container w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121215] shadow-2xl">
      <article
        ref={articleRef}
        class="markdown-body obsidian-preview w-full"
        innerHTML={htmlContent() || "<p>Loading document...</p>"}
      />
    </div>
  );
}
