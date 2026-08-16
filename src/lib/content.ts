export interface MarkdownFile {
  path: string;
  name: string;
  relativePath: string[];
  content: string;
}

const markdownFiles = import.meta.glob("../Golang/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const documents: MarkdownFile[] = Object.entries(markdownFiles)
  .map(([path, content]) => {
    // Remove everything before the Golang folder
    const cleanPath = path.replace(/^.*\/Golang\//, "");

    // Split folders and filename
    const parts = cleanPath.split("/");

    // Remove .md extension from filename
    const fileName = parts.pop()?.replace(/\.md$/, "") ?? "";

    return {
      path,
      name: fileName,
      relativePath: parts,
      content,
    };
  })
  .sort((a, b) =>
    a.path.localeCompare(b.path, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
