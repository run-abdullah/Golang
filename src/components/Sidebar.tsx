import { For, createSignal, Show, createMemo } from "solid-js";
import type { MarkdownFile } from "../lib/content";

interface SidebarProps {
  documents: MarkdownFile[];
  selectedPath: string | null;
  onSelect: (doc: MarkdownFile) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface TreeNode {
  name: string;
  fullPath: string;
  files: MarkdownFile[];
  subFolders: Map<string, TreeNode>;
}

export default function Sidebar(props: SidebarProps) {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [openFolders, setOpenFolders] = createSignal<Set<string>>(
    new Set(["root"]),
  );

  const tree = createMemo(() => {
    const root: TreeNode = {
      name: "Golang",
      fullPath: "root",
      files: [],
      subFolders: new Map(),
    };

    const q = searchQuery().toLowerCase();
    const filteredDocs = props.documents.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.relativePath.some((p) => p.toLowerCase().includes(q)),
    );

    for (const doc of filteredDocs) {
      let current = root;
      let pathAccumulator = "root";

      for (const folder of doc.relativePath) {
        pathAccumulator += `/${folder}`;
        if (!current.subFolders.has(folder)) {
          current.subFolders.set(folder, {
            name: folder,
            fullPath: pathAccumulator,
            files: [],
            subFolders: new Map(),
          });
        }
        current = current.subFolders.get(folder)!;
      }
      current.files.push(doc);
    }
    return root;
  });

  const toggleFolder = (folderPath: string) => {
    const next = new Set(openFolders());
    if (next.has(folderPath)) next.delete(folderPath);
    else next.add(folderPath);
    setOpenFolders(next);
  };

  return (
    <>
      <Show when={props.isOpen}>
        <div
          onClick={props.onClose}
          class="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
        />
      </Show>

      <aside
        style={{ "background-color": "var(--bg-sidebar)" }}
        class={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-zinc-800/80 p-4 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          props.isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div class="mb-5 flex items-center justify-between px-2">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0">
              <img
                src="/logo.svg"
                alt="Abdullah Riaz"
                class="h-10 w-10 rounded-xl border border-white/10 object-cover shadow-[0_0_15px_var(--accent-glow)]"
              />
            </div>

            <div class="min-w-0">
              <h1 class="text-sm font-bold tracking-wide text-zinc-100 truncate">
                Abdullah Riaz
              </h1>
              <div class="flex items-center gap-1.5">
                <span class="text-[11px] font-medium text-zinc-400">
                  Golang Docs Vault
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={props.onClose}
            class="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div class="relative mb-4">
          <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full rounded-xl bg-zinc-900/90 py-2 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-500 border border-zinc-800/80 focus:border-[var(--accent-primary)] focus:outline-none transition-all"
          />
        </div>

        {/* Tree Container */}
        <div class="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          <RenderNode
            node={tree()}
            selectedPath={props.selectedPath}
            onSelect={(doc) => {
              props.onSelect(doc);
              props.onClose();
            }}
            openFolders={openFolders()}
            toggleFolder={toggleFolder}
          />
        </div>
      </aside>
    </>
  );
}

function RenderNode(props: {
  node: TreeNode;
  selectedPath: string | null;
  onSelect: (doc: MarkdownFile) => void;
  openFolders: Set<string>;
  toggleFolder: (path: string) => void;
}) {
  const subFolderArray = () =>
    Array.from(props.node.subFolders.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

  return (
    <div class="space-y-0.5">
      <For each={subFolderArray()}>
        {(subNode) => {
          const isOpen = () => props.openFolders.has(subNode.fullPath);
          return (
            <div>
              <button
                type="button"
                onClick={() => props.toggleFolder(subNode.fullPath)}
                class="group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-900/80 transition-all"
              >
                <div class="flex items-center gap-2 truncate">
                  <svg
                    style={{
                      color: isOpen()
                        ? "var(--icon-primary)"
                        : "var(--icon-[#a3e635]muted)",
                    }}
                    class={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen() ? "rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <svg
                    style={{ color: "var(--icon-primary)" }}
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span class="truncate">{subNode.name}</span>
                </div>
              </button>

              <Show when={isOpen()}>
                <div class="ml-3.5 pl-2.5 border-l border-zinc-800/60 my-0.5 space-y-0.5">
                  <RenderNode
                    node={subNode}
                    selectedPath={props.selectedPath}
                    onSelect={props.onSelect}
                    openFolders={props.openFolders}
                    toggleFolder={props.toggleFolder}
                  />
                </div>
              </Show>
            </div>
          );
        }}
      </For>

      <For each={props.node.files}>
        {(doc) => {
          const isSelected = () => props.selectedPath === doc.path;
          return (
            <button
              type="button"
              onClick={() => props.onSelect(doc)}
              style={
                isSelected()
                  ? {
                      "background-color": "var(--accent-primary)",
                      color: "var(--accent-text)",
                      "box-shadow": "0 0 12px var(--accent-glow)",
                    }
                  : {}
              }
              class={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-all ${
                isSelected()
                  ? "font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
              }`}
            >
              <svg
                style={{
                  color: isSelected()
                    ? "var(--accent-text)"
                    : "var(--icon-[#a3e635]muted)",
                }}
                class="h-3.5 w-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="truncate">{doc.name}</span>
            </button>
          );
        }}
      </For>
    </div>
  );
}
