"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, Star, Hash, Clock, ChevronRight } from "lucide-react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { Spotlight } from "@/components/app/Spotlight";
import { NoteCardMenu } from "@/components/app/NoteCardMenu";
import { Surface, bloom, stagger } from "@/components/ui";
import type { NoteListItem } from "@/lib/notes";
import { useResponsiveSidebar } from "@/lib/use-responsive-sidebar";
import {
  createNote,
  toggleStar as toggleStarAction,
  archiveNote as archiveNoteAction,
  restoreNote as restoreNoteAction,
  deleteNoteForever as deleteNoteForeverAction,
  emptyTrash as emptyTrashAction,
} from "@/app/actions/notes";

type Filter = "all" | "starred" | "recent" | "trash";

export function NotesShell({
  user,
  initialNotes,
  archivedNotes,
  tags,
}: {
  user: { name: string; email: string };
  initialNotes: NoteListItem[];
  archivedNotes: NoteListItem[];
  tags: string[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [sidebarOpen, setSidebarOpen] = useResponsiveSidebar();
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [, startTransition] = useTransition();

  const inTrash = activeFilter === "trash";
  const sourceList = inTrash ? archivedNotes : initialNotes;

  const visible = sourceList
    .filter((n) => {
      if (activeFilter === "starred") return n.starred;
      return true;
    })
    .filter((n) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.tags.some((t) => t.includes(q))
      );
    });

  const filterCounts = {
    all: initialNotes.length,
    starred: initialNotes.filter((n) => n.starred).length,
    trash: archivedNotes.length,
  };

  const handleNewNote = () => {
    startTransition(async () => {
      await createNote();
    });
  };

  const handleToggleStar = (id: string) => {
    startTransition(async () => {
      await toggleStarAction(id);
    });
  };

  const handleTrash = (id: string) => {
    startTransition(async () => {
      await archiveNoteAction(id);
    });
  };

  const handleRestore = (id: string) => {
    startTransition(async () => {
      await restoreNoteAction(id);
    });
  };

  const handleDeleteForever = (id: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Permanently delete this note? This cannot be undone.")
    ) {
      return;
    }
    startTransition(async () => {
      await deleteNoteForeverAction(id);
    });
  };

  const handleEmptyTrash = () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Permanently delete all ${archivedNotes.length} notes in trash? This cannot be undone.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      await emptyTrashAction();
    });
  };

  const filterLabel: Record<Filter, string> = {
    all: "All Notes",
    starred: "Starred",
    recent: "Recent",
    trash: "Trash",
  };

  return (
    <div className="min-h-screen flex bg-ink-1 font-sans">
      <AppSidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        tags={tags}
        filterCounts={filterCounts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onNewNote={handleNewNote}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          search={search}
          setSearch={setSearch}
          onOpenSpotlight={() => setSpotlightOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="min-w-0">
              <h1 className="font-serif text-text-1 text-xl sm:text-2xl font-light tracking-tight">
                {filterLabel[activeFilter]}
              </h1>
              <p className="text-text-3 text-xs mt-0.5">
                {visible.length} {visible.length === 1 ? "note" : "notes"}
                {inTrash &&
                  archivedNotes.length > 0 &&
                  " · auto-deleted after 30 days"}
              </p>
            </div>
            {inTrash && archivedNotes.length > 0 && (
              <button
                onClick={handleEmptyTrash}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line-2 text-xs font-medium text-[#e03131] hover:bg-[rgba(224,49,49,0.08)] transition-colors shrink-0"
              >
                Empty trash
              </button>
            )}
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={stagger()}
            initial="hidden"
            animate="show"
            key={activeFilter}
          >
            {!inTrash && (
              <motion.button
                variants={bloom}
                onClick={handleNewNote}
                className="rounded-2xl p-5 flex flex-col items-center justify-center gap-2 min-h-[180px] transition-colors duration-200 group bg-vellum-1 border border-dashed border-line-2 hover:bg-vellum-2 hover:border-line-3"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-vellum-3">
                  <Plus className="w-4 h-4 text-text-3" />
                </div>
                <span className="text-text-3 text-xs font-light group-hover:text-text-2 transition-colors">
                  New note
                </span>
              </motion.button>
            )}

            {visible.map((note) =>
              inTrash ? (
                <NoteCard
                  key={note.id}
                  note={note}
                  inTrash
                  onRestore={() => handleRestore(note.id)}
                  onDeleteForever={() => handleDeleteForever(note.id)}
                  onOpen={() => router.push(`/notes/${note.id}`)}
                />
              ) : (
                <NoteCard
                  key={note.id}
                  note={note}
                  onStar={() => handleToggleStar(note.id)}
                  onTrash={() => handleTrash(note.id)}
                  onOpen={() => router.push(`/notes/${note.id}`)}
                />
              ),
            )}
          </motion.div>

          {inTrash && visible.length === 0 && (
            <Surface className="mt-8 p-10 text-center">
              <p className="font-serif text-text-2 text-2xl font-light mb-2">
                Trash is empty.
              </p>
              <p className="text-text-3 text-sm font-light">
                Notes you delete from the dashboard land here.
              </p>
            </Surface>
          )}

          {visible.length === 0 && initialNotes.length === 0 && !inTrash && (
            <Surface className="mt-8 p-10 text-center">
              <p className="font-serif text-text-2 text-2xl font-light mb-2">
                A blank page.
              </p>
              <p className="text-text-3 text-sm font-light">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded border border-line-2 text-text-2 text-xs font-mono">
                  ⌘K
                </kbd>{" "}
                to capture your first thought.
              </p>
            </Surface>
          )}
        </main>
      </div>

      <Spotlight
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        notes={initialNotes}
      />
    </div>
  );
}

function NoteCard({
  note,
  onStar,
  onTrash,
  onRestore,
  onDeleteForever,
  inTrash,
  onOpen,
}: {
  note: NoteListItem;
  onStar?: () => void;
  onTrash?: () => void;
  onRestore?: () => void;
  onDeleteForever?: () => void;
  inTrash?: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div
      variants={bloom}
      onClick={onOpen}
      className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer group min-h-[180px] bg-vellum-1 border border-line-1 hover:bg-vellum-2 hover:border-line-2 transition-all"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-text-1 text-base font-light leading-snug flex-1 line-clamp-2">
          {note.title || "Untitled"}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          {!inTrash && onStar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStar();
              }}
              className={
                "p-1 rounded-md transition-colors " +
                (note.starred ? "" : "opacity-0 group-hover:opacity-100")
              }
              aria-label={note.starred ? "Unstar" : "Star"}
              style={{
                color: note.starred ? "#f5d75e" : "var(--color-text-3)",
              }}
            >
              <Star
                className="w-3.5 h-3.5"
                fill={note.starred ? "#f5d75e" : "none"}
              />
            </button>
          )}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <NoteCardMenu
              starred={note.starred}
              inTrash={inTrash}
              onStar={onStar}
              onTrash={onTrash}
              onRestore={onRestore}
              onDeleteForever={onDeleteForever}
            />
          </div>
        </div>
      </div>

      <p className="text-text-3 text-xs font-light leading-relaxed flex-1 line-clamp-3">
        {note.excerpt || "Empty"}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {note.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-vellum-2 text-text-3"
            >
              <Hash className="w-2 h-2" />
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-text-4">
          <Clock className="w-2.5 h-2.5" />
          <span className="text-xs">{note.updatedAt}</span>
          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  );
}
