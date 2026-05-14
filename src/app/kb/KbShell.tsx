"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { List, Network, FileText } from "lucide-react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { TagPill, bloom, stagger } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useResponsiveSidebar } from "@/lib/use-responsive-sidebar";

type View = "list" | "graph";

const GraphView = dynamic(() => import("./GraphView").then((m) => m.GraphView), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-text-4 text-xs font-light">
      Drawing the wall…
    </div>
  ),
});

interface NoteRow {
  id: string;
  title: string;
  tags: string[];
}

interface Link {
  source: string;
  target: string;
}

export function KbShell({
  user,
  notes,
  links,
  tags,
}: {
  user: { name: string; email: string };
  notes: NoteRow[];
  links: Link[];
  tags: string[];
}) {
  const [sidebarOpen, setSidebarOpen] = useResponsiveSidebar();
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.tags.some((t) => t.includes(q)),
    );
  }, [notes, search]);

  const groupedByTag = useMemo(() => {
    const groups = new Map<string, NoteRow[]>();
    groups.set("untagged", []);
    for (const n of filtered) {
      if (n.tags.length === 0) {
        groups.get("untagged")!.push(n);
        continue;
      }
      for (const t of n.tags) {
        if (!groups.has(t)) groups.set(t, []);
        groups.get(t)!.push(n);
      }
    }
    if (groups.get("untagged")!.length === 0) groups.delete("untagged");
    return [...groups.entries()].sort(([a], [b]) => {
      if (a === "untagged") return 1;
      if (b === "untagged") return -1;
      return a.localeCompare(b);
    });
  }, [filtered]);

  return (
    <div className="min-h-screen flex bg-ink-1 font-sans">
      <AppSidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        tags={tags}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          search={search}
          setSearch={setSearch}
          searchPlaceholder="Search the wall…"
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-serif text-text-1 text-2xl sm:text-3xl font-light tracking-tight">
                The Wall
              </h1>
              <p className="text-text-3 text-xs font-light mt-1">
                {notes.length} notes · {links.length} links
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-full bg-vellum-2 border border-line-1 shrink-0">
              <ViewToggle
                active={view === "list"}
                onClick={() => setView("list")}
                icon={List}
                label="List"
              />
              <ViewToggle
                active={view === "graph"}
                onClick={() => setView("graph")}
                icon={Network}
                label="Graph"
              />
            </div>
          </div>

          {view === "list" ? (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-12">
              {groupedByTag.length === 0 && (
                <div className="text-center py-24">
                  <p className="font-serif text-text-2 text-2xl font-light">
                    Nothing yet.
                  </p>
                  <p className="text-text-3 text-sm font-light mt-2">
                    Write a note. Link it with{" "}
                    <code className="font-mono text-text-2">[[double brackets]]</code>.
                  </p>
                </div>
              )}
              {groupedByTag.map(([tag, group]) => (
                <motion.section
                  key={tag}
                  className="mb-12"
                  variants={stagger()}
                  initial="hidden"
                  animate="show"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <TagPill tag={tag === "untagged" ? "untagged" : tag} size="sm" />
                    <span className="text-text-4 text-xs">{group.length}</span>
                    <div className="flex-1 h-px bg-line-1" />
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                    {group.map((n) => (
                      <motion.li key={n.id} variants={bloom}>
                        <Link
                          href={`/notes/${n.id}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-vellum-1 border border-line-1 hover:bg-vellum-2 hover:border-line-2 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0 text-text-4" />
                          <span className="font-serif text-text-1 text-sm font-light truncate flex-1">
                            {n.title}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>
              ))}
            </div>
          ) : (
            <GraphView notes={notes} links={links} />
          )}
        </main>
      </div>
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof List;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-light transition-colors",
        active
          ? "bg-candle-grad text-ink-1"
          : "text-text-3 hover:text-text-1",
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}
