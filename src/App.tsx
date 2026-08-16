import { createSignal, Show, For } from "solid-js";
import Sidebar from "./components/Sidebar";
import MarkdownViewer from "./components/MarkdownViewer";
import { documents, type MarkdownFile } from "./lib/content";

function App() {
  const [selectedDocument, setSelectedDocument] =
    createSignal<MarkdownFile | null>(documents[0] ?? null);
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

  return (
    <div class="flex h-screen bg-[#0d0d0d] font-sans text-zinc-100 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        documents={documents}
        selectedPath={selectedDocument()?.path ?? null}
        onSelect={setSelectedDocument}
        isOpen={isSidebarOpen()}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div class="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header class="flex items-center justify-between border-b border-[#1f1f1f] bg-[#121212]/80 px-4 py-3.5 backdrop-blur-md lg:px-8">
          <div class="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              class="rounded-xl bg-[#1e1e1e] p-2 text-zinc-300 hover:text-white lg:hidden"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Show when={selectedDocument()}>
              {(doc) => (
                <div class="flex items-center gap-2 text-xs font-medium text-zinc-400">
                  <span>Golang</span>
                  <For each={doc().relativePath}>
                    {(folder) => (
                      <>
                        <span>/</span>
                        <span class="text-zinc-300">{folder}</span>
                      </>
                    )}
                  </For>
                </div>
              )}
            </Show>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div class="mx-auto max-w-5xl">
            <Show
              when={selectedDocument()}
              fallback={
                <div class="flex h-[70vh] flex-col items-center justify-center rounded-3xl border border-dashed border-[#262626] text-zinc-500">
                  <svg
                    class="mb-3 h-10 w-10 text-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>Koi note select karo read karne ke liye</span>
                </div>
              }
            >
              {(doc) => (
                <div class="space-y-6">
                  {/* Document Title Header (Cleaned up, Path Removed) */}
                  <div class="flex items-center justify-between rounded-3xl border border-[#222222] bg-[#121212] px-6 py-5 sm:px-8 sm:py-6 shadow-xl">
                    <div class="flex items-center gap-4">
                      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/20 shadow-[0_0_15px_rgba(163,230,53,0.15)]">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h1 class="text-2xl font-extrabold text-white sm:text-3xl tracking-tight">
                        {doc().name.replace(/^[\d\s.\-_]+/, "")}
                      </h1>
                    </div>

                    <span class="inline-flex items-center rounded-full bg-[#1a1a1a] px-3 py-1 text-xs font-medium text-zinc-400 border border-zinc-800">
                      Markdown
                    </span>
                  </div>

                  {/* Markdown Renderer Card */}
                  <MarkdownViewer content={doc().content} />
                </div>
              )}
            </Show>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
