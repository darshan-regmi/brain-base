"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NoteListItem } from "@/lib/notes";
import { createNote } from "@/app/actions/notes";

/**
 * ⌘K spotlight — the headline microinteraction.
 * Pure input + 3 result rows. ESC dismisses.
 */
export function Spotlight({
  open,
  onClose,
  notes,
}: {
  open: boolean;
  onClose: () => void;
  notes: NoteListItem[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Reset to a clean slate whenever the spotlight transitions to open. The
     two setStates are syncing UI to an external state change (the panel
     opening), not redundant rendering. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) {
      setQ("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = q
    ? notes
        .filter((n) => {
          const lower = q.toLowerCase();
          return (
            n.title.toLowerCase().includes(lower) ||
            n.excerpt.toLowerCase().includes(lower) ||
            n.tags.some((t) => t.includes(lower))
          );
        })
        .slice(0, 5)
    : notes.slice(0, 3);

  const handleSelect = (i: number) => {
    const n = filtered[i];
    if (!n) return;
    router.push(`/notes/${n.id}`);
    onClose();
  };

  const handleKey = async (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx === filtered.length) {
        await createNote();
      } else {
        handleSelect(activeIdx);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 top-[20vh] z-50 mx-auto max-w-xl px-4"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl bg-ink-2 border border-line-2 shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-line-1">
                <Search className="w-4 h-4 text-text-3" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setActiveIdx(0);
                  }}
                  onKeyDown={handleKey}
                  placeholder="Search or capture…"
                  className="flex-1 bg-transparent font-serif text-text-1 text-xl font-light outline-none placeholder:text-text-4"
                />
                <kbd className="text-text-4 text-[10px] font-mono border border-line-1 rounded px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              <div className="py-2 max-h-[50vh] overflow-y-auto">
                {filtered.map((n, i) => (
                  <button
                    key={n.id}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => handleSelect(i)}
                    className={cn(
                      "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors",
                      activeIdx === i ? "bg-vellum-2" : "hover:bg-vellum-1",
                    )}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-text-3" />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-text-1 text-sm font-light truncate">
                        {n.title || "Untitled"}
                      </p>
                      <p className="text-text-3 text-xs font-light truncate mt-0.5">
                        {n.excerpt || "—"}
                      </p>
                    </div>
                    <span className="text-text-4 text-xs shrink-0">
                      {n.updatedAt}
                    </span>
                  </button>
                ))}

                <form action={createNote}>
                  <button
                    type="submit"
                    onMouseEnter={() => setActiveIdx(filtered.length)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-3 text-left transition-colors border-t border-line-1",
                      activeIdx === filtered.length
                        ? "bg-vellum-2"
                        : "hover:bg-vellum-1",
                    )}
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0 text-candle-2" />
                    <span className="text-text-2 text-sm font-light">
                      {q ? `Create "${q}"` : "New blank note"}
                    </span>
                    <span className="ml-auto text-text-4 text-xs">↵</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
