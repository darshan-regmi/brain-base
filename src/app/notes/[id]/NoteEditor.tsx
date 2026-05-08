"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Hash,
  ArrowLeft,
  Loader2,
  Check,
  X,
  Plus,
} from "lucide-react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { Spotlight } from "@/components/app/Spotlight";
import {
  updateNote,
  toggleStar,
  setTags,
} from "@/app/actions/notes";
import { relativeTime } from "@/lib/dates";

type Note = {
  id: string;
  title: string;
  content: string;
  starred: boolean;
  tags: string[];
  updatedAt: string;
};

type SaveState = "idle" | "saving" | "saved";

export function NoteEditor({
  user,
  note,
  allTags,
  backlinks,
}: {
  user: { name: string; email: string };
  note: Note;
  allTags: string[];
  backlinks: { id: string; title: string }[];
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setLocalTags] = useState<string[]>(note.tags);
  const [starred, setStarred] = useState(note.starred);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<Date>(new Date(note.updatedAt));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [, startTransition] = useTransition();

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaved = useRef({ title: note.title, content: note.content });

  /* Debounced autosave — setSaveState is the user-visible feedback channel for
     an effect that already syncs an external system (the database). */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (
      title === lastSaved.current.title &&
      content === lastSaved.current.content
    ) {
      return;
    }
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await updateNote(note.id, { title, content });
      lastSaved.current = { title, content };
      setSaveState("saved");
      setSavedAt(new Date());
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, content, note.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleStar = () => {
    setStarred((s) => !s);
    startTransition(async () => {
      await toggleStar(note.id);
    });
  };

  const handleAddTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || tags.includes(t)) {
      setTagInput("");
      return;
    }
    const next = [...tags, t];
    setLocalTags(next);
    setTagInput("");
    startTransition(async () => {
      await setTags(note.id, next);
    });
  };

  const handleRemoveTag = (t: string) => {
    const next = tags.filter((x) => x !== t);
    setLocalTags(next);
    startTransition(async () => {
      await setTags(note.id, next);
    });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen flex bg-ink-1 font-sans">
      <AppSidebar
        user={user}
        open={sidebarOpen}
        tags={allTags}
        onNewNote={undefined}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSpotlight={() => setSpotlightOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-text-3 hover:text-text-2 text-xs font-light transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Notes
              </Link>

              <div className="flex items-center gap-3 text-text-3 text-xs font-light">
                <span>{wordCount.toLocaleString()} words</span>
                <span className="text-line-3">·</span>
                <SaveIndicator state={saveState} savedAt={savedAt} />
                <button
                  onClick={handleStar}
                  className="ml-2 transition-colors"
                  aria-label={starred ? "Unstar" : "Star"}
                  style={{
                    color: starred ? "#F5E7C6" : "rgba(255,255,255,0.25)",
                  }}
                >
                  <Star className="w-4 h-4" fill={starred ? "#F5E7C6" : "none"} />
                </button>
              </div>
            </div>

            <motion.input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled."
              className="w-full bg-transparent font-serif text-text-1 text-5xl font-light leading-tight outline-none placeholder:text-text-4 mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />

            <div className="flex flex-wrap items-center gap-1.5 mb-8">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => handleRemoveTag(t)}
                  className="group inline-flex items-center gap-1 px-2 py-1 rounded-md bg-vellum-2 border border-line-1 text-text-3 hover:text-text-1 hover:border-line-2 text-xs font-light transition-colors"
                >
                  <Hash className="w-2.5 h-2.5" />
                  {t}
                  <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
              <div className="inline-flex items-center gap-1 px-2 py-1">
                <Plus className="w-2.5 h-2.5 text-text-4" />
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  onBlur={handleAddTag}
                  placeholder="add tag"
                  className="bg-transparent text-text-3 text-xs font-light outline-none placeholder:text-text-4 w-20"
                  list="all-tags"
                />
                <datalist id="all-tags">
                  {allTags.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>
            </div>

            <motion.textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Begin…"
              className="w-full bg-transparent text-text-1 text-base font-light leading-[1.85] outline-none placeholder:text-text-4 resize-none min-h-[60vh] font-sans"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            />

            {backlinks.length > 0 && (
              <div className="mt-16 pt-8 border-t border-line-1">
                <p className="text-text-4 text-xs tracking-widest uppercase mb-4">
                  Linked from
                </p>
                <ul className="flex flex-col gap-2">
                  {backlinks.map((bl) => (
                    <li key={bl.id}>
                      <Link
                        href={`/notes/${bl.id}`}
                        className="font-serif text-text-2 hover:text-text-1 text-base font-light transition-colors"
                      >
                        ↳ {bl.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>

      <Spotlight
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        notes={[]}
      />
    </div>
  );
}

function SaveIndicator({
  state,
  savedAt,
}: {
  state: SaveState;
  savedAt: Date;
}) {
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-text-4">
        <Loader2 className="w-3 h-3 animate-spin" />
        Saving…
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-text-4">
      <Check className="w-3 h-3" />
      Saved {relativeTime(savedAt).toLowerCase()}
    </span>
  );
}
