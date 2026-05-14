"use client";

import { Search, Menu, X } from "lucide-react";
import { useEffect } from "react";
import { NotificationPopover } from "./NotificationPopover";

export function AppTopbar({
  onToggleSidebar,
  search,
  setSearch,
  onOpenSpotlight,
  searchPlaceholder = "Search notes…",
}: {
  onToggleSidebar: () => void;
  search?: string;
  setSearch?: (v: string) => void;
  onOpenSpotlight?: () => void;
  searchPlaceholder?: string;
}) {
  useEffect(() => {
    if (!onOpenSpotlight) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenSpotlight();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenSpotlight]);

  return (
    <header className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 py-3 sm:py-4 sticky top-0 z-10 bg-ink-1/85 backdrop-blur-xl border-b border-line-1">
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center w-9 h-9 rounded-md text-text-3 hover:text-text-1 hover:bg-vellum-2 transition-colors shrink-0"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>

      {setSearch !== undefined && (
        <div className="flex-1 min-w-0 sm:max-w-md flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-xl bg-vellum-2 border border-line-1">
          <Search className="w-3.5 h-3.5 shrink-0 text-text-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 min-w-0 bg-transparent text-text-2 text-xs font-light outline-none placeholder:text-text-4"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-text-4 hover:text-text-2 transition-colors shrink-0"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto shrink-0">
        {onOpenSpotlight && (
          <button
            onClick={onOpenSpotlight}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-line-1 text-text-4 hover:text-text-2 hover:border-line-2 transition-colors text-[10px] font-mono"
            aria-label="Open spotlight"
          >
            <span>⌘</span>
            <span>K</span>
          </button>
        )}
        <NotificationPopover />
      </div>
    </header>
  );
}
