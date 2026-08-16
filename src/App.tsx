import { createSignal, Show, For, createMemo } from "solid-js";
import Sidebar from "./components/Sidebar";
import MarkdownViewer from "./components/MarkdownViewer";
import { documents, type MarkdownFile } from "./lib/content";

function App() {
  const [selectedDocument, setSelectedDocument] =
    createSignal<MarkdownFile | null>(documents[0] ?? null);

  const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

  // ✅ FIX: Ref for main scrollable element
  let mainRef: HTMLElement | undefined;

  // Get current index
  const currentIndex = createMemo(() => {
    const current = selectedDocument();
    if (!current) return -1;
    return documents.findIndex((doc) => doc.path === current.path);
  });

  // Get previous document
  const previousDocument = createMemo(() => {
    const index = currentIndex();
    if (index > 0) {
      return documents[index - 1];
    }
    return null;
  });

  // Get next document
  const nextDocument = createMemo(() => {
    const index = currentIndex();
    if (index >= 0 && index < documents.length - 1) {
      return documents[index + 1];
    }
    return null;
  });

  // ✅ FIX: Scroll to top function
  const scrollToTop = () => {
    if (mainRef) {
      mainRef.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✅ FIX: Navigate function
  const navigateTo = (doc: MarkdownFile) => {
    setSelectedDocument(doc);
    setIsSidebarOpen(false);
    scrollToTop();
  };

  return (
    <div class="flex h-[100dvh] w-full overflow-hidden bg-[var(--bg-main)] font-sans text-zinc-100 antialiased">
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <Sidebar
        documents={documents}
        selectedPath={selectedDocument()?.path ?? null}
        onSelect={(document) => {
          navigateTo(document);
        }}
        isOpen={isSidebarOpen()}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* =====================================================
          MAIN APPLICATION
          ===================================================== */}

      <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ===================================================
            HEADER
            =================================================== */}

        <header class="z-30 flex h-12 shrink-0 items-center border-b border-[#1f1f1f] bg-[#121212]/95 px-3 backdrop-blur-md sm:h-16 sm:px-6 lg:px-8">
          <div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
            {/* Mobile Sidebar Button */}

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              class="shrink-0 rounded-lg bg-[#1e1e1e] p-2 text-zinc-300 transition hover:bg-[#252525] hover:text-white active:scale-95 lg:hidden"
              aria-label="Open sidebar"
            >
              <svg
                class="h-4 w-4 sm:h-5 sm:w-5"
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

            {/* Breadcrumb */}

            <Show when={selectedDocument()}>
              {(document) => (
                <div class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-[11px] font-medium sm:gap-1.5 sm:text-xs">
                  <span class="hidden shrink-0 text-zinc-500 md:inline">
                    Golang
                  </span>

                  <ForEachPath document={document()} />
                </div>
              )}
            </Show>
          </div>

          {/* Progress indicator */}
          <Show when={selectedDocument()}>
            <div class="ml-2 hidden shrink-0 text-[10px] text-zinc-500 sm:ml-4 sm:text-xs">
              {currentIndex() + 1} / {documents.length}
            </div>
          </Show>
        </header>

        {/* ===================================================
            SCROLLABLE DOCUMENT AREA
            =================================================== */}

        <main
          ref={mainRef}
          class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain custom-scrollbar"
        >
          <div class="mx-auto w-full max-w-full px-3 py-3 sm:max-w-3xl sm:px-6 sm:py-5 lg:max-w-4xl lg:px-8 lg:py-6 xl:max-w-5xl 2xl:max-w-6xl">
            <Show when={selectedDocument()} fallback={<EmptyState />}>
              {(document) => (
                <div class="min-w-0">
                  {/* =================================================
                      DOCUMENT HEADER
                      ================================================= */}

                  <div class="mb-4 flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#222222] bg-[#121212] px-3.5 py-3 shadow-lg sm:mb-6 sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-5 lg:mb-7 lg:rounded-3xl lg:px-8 lg:py-6">
                    <div class="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4">
                      {/* Document Icon */}

                      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#a3e635]/20 bg-[#a3e635]/10 text-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.15)] sm:h-11 sm:w-11 sm:rounded-2xl">
                        <svg
                          class="h-3.5 w-3.5 sm:h-5 sm:w-5"
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

                      {/* Document Name */}

                      <h1 class="min-w-0 truncate text-base font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                        {document().name.replace(/^[\d\s._-]+/, "")}
                      </h1>
                    </div>

                    {/* File Type - Hidden on very small screens */}

                    <span class="hidden shrink-0 rounded-full border border-zinc-800 bg-[#1a1a1a] px-2 py-0.5 text-[9px] font-medium text-zinc-400 min-[400px]:inline sm:px-2.5 sm:py-1 sm:text-xs">
                      Markdown
                    </span>
                  </div>

                  {/* =================================================
                      MARKDOWN DOCUMENT
                      ================================================= */}

                  <MarkdownViewer content={document().content} />

                  {/* =================================================
                      NEXT / PREVIOUS NAVIGATION
                      ================================================= */}

                  <div class="mt-6 flex flex-col gap-3 border-t border-[#222222] pt-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6">
                    {/* Previous Button */}
                    <Show
                      when={previousDocument()}
                      fallback={<div class="hidden sm:block" />}
                    >
                      {(prevDoc) => (
                        <button
                          type="button"
                          onClick={() => navigateTo(prevDoc())}
                          class="group flex items-center gap-2 rounded-xl border border-[#222222] bg-[#121212] px-4 py-3 text-left transition-all hover:border-[#a3e635]/30 hover:bg-[#1a1a1a] active:scale-[0.98] sm:px-5 sm:py-4"
                        >
                          <svg
                            class="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-[#a3e635] sm:h-5 sm:w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          <div class="min-w-0">
                            <div class="text-[10px] font-medium text-zinc-500 sm:text-xs">
                              Previous
                            </div>
                            <div class="truncate text-xs font-semibold text-zinc-300 group-hover:text-white sm:text-sm">
                              {prevDoc().name.replace(/^[\d\s._-]+/, "")}
                            </div>
                          </div>
                        </button>
                      )}
                    </Show>

                    {/* Next Button */}
                    <Show when={nextDocument()}>
                      {(nextDoc) => (
                        <button
                          type="button"
                          onClick={() => navigateTo(nextDoc())}
                          class="group flex items-center justify-end gap-2 rounded-xl border border-[#222222] bg-[#121212] px-4 py-3 text-right transition-all hover:border-[#a3e635]/30 hover:bg-[#1a1a1a] active:scale-[0.98] sm:ml-auto sm:px-5 sm:py-4"
                        >
                          <div class="min-w-0">
                            <div class="text-[10px] font-medium text-zinc-500 sm:text-xs">
                              Next
                            </div>
                            <div class="truncate text-xs font-semibold text-zinc-300 group-hover:text-white sm:text-sm">
                              {nextDoc().name.replace(/^[\d\s._-]+/, "")}
                            </div>
                          </div>
                          <svg
                            class="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-[#a3e635] sm:h-5 sm:w-5"
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
                        </button>
                      )}
                    </Show>
                  </div>
                </div>
              )}
            </Show>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   BREADCRUMB PATH
   ============================================================= */

function ForEachPath(props: { document: MarkdownFile }) {
  return (
    <>
      <For each={props.document.relativePath}>
        {(folder, index) => (
          <>
            <span class="shrink-0 text-zinc-700">/</span>

            <span
              class={`truncate ${
                index() === props.document.relativePath.length - 1
                  ? "max-w-[120px] font-semibold text-zinc-200 min-[400px]:max-w-[160px] sm:max-w-none"
                  : "hidden text-zinc-500 sm:inline"
              }`}
            >
              {folder}
            </span>
          </>
        )}
      </For>
    </>
  );
}

/* =============================================================
   EMPTY STATE
   ============================================================= */

function EmptyState() {
  return (
    <div class="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[#262626] px-4 py-8 text-center sm:min-h-[60vh] sm:rounded-3xl sm:px-6">
      <svg
        class="mb-3 h-8 w-8 text-zinc-600 sm:mb-4 sm:h-10 sm:w-10"
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

      <p class="text-xs text-zinc-500 sm:text-sm">
        Koi note select karo read karne ke liye
      </p>
    </div>
  );
}

export default App;
