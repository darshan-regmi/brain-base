"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Star,
  Clock,
  ChevronRight,
  Timer,
  Repeat2,
  ArrowRight,
} from "lucide-react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { Spotlight } from "@/components/app/Spotlight";
import { Surface, StatCard, bloom, stagger } from "@/components/ui";
import type { NoteListItem, DashboardStats } from "@/lib/notes";
import { createNote } from "@/app/actions/notes";

const FOCUS_DAILY_TARGET = 6;

export function DashboardShell({
  user,
  stats,
  recentNotes,
  starredNotes,
  dueReviewCount,
  todayFocusCount,
}: {
  user: { name: string; email: string };
  stats: DashboardStats;
  recentNotes: NoteListItem[];
  starredNotes: NoteListItem[];
  dueReviewCount: number;
  todayFocusCount: number;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleNewNote = () => {
    startTransition(async () => {
      await createNote();
    });
  };

  return (
    <div className="min-h-screen flex bg-ink-1 font-sans">
      <AppSidebar user={user} open={sidebarOpen} onNewNote={handleNewNote} />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSpotlight={() => setSpotlightOpen(true)}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <OverviewPanel
            userName={user.name}
            stats={stats}
            recent={recentNotes}
            starred={starredNotes}
            dueReviewCount={dueReviewCount}
            todayFocusCount={todayFocusCount}
            onOpenNote={(id) => router.push(`/notes/${id}`)}
            onNewNote={handleNewNote}
          />
        </main>
      </div>

      <Spotlight
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        notes={recentNotes}
      />
    </div>
  );
}

/* ─── Overview ────────────────────────────────────────────────────────────
   Live clock + greeting, summary stats, top-5 recent and starred notes,
   plus quick-start panels for the focus timer and review queue. */

function OverviewPanel({
  userName,
  stats,
  recent,
  starred,
  dueReviewCount,
  todayFocusCount,
  onOpenNote,
  onNewNote,
}: {
  userName: string;
  stats: DashboardStats;
  recent: NoteListItem[];
  starred: NoteListItem[];
  dueReviewCount: number;
  todayFocusCount: number;
  onOpenNote: (id: string) => void;
  onNewNote: () => void;
}) {
  const statValues = [
    { label: "Notes", value: String(stats.notes), delta: stats.notesDelta },
    { label: "Words", value: stats.words, delta: stats.wordsDelta },
    {
      label: "Streak",
      value: `${stats.streak}d`,
      delta: stats.streakLabel,
    },
  ];

  const firstName = userName.split(" ")[0] || userName;

  return (
    <motion.div
      variants={stagger()}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={bloom}>
        <ClockHeader greeting={`Hello, ${firstName}.`} />
      </motion.div>

      <motion.div variants={bloom} className="grid grid-cols-3 gap-4">
        {statValues.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
          />
        ))}
      </motion.div>

      <motion.div
        variants={bloom}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <NoteListPanel
          title="Recent"
          icon={Clock}
          notes={recent}
          emptyHint="Nothing yet — start your first note."
          ctaLabel="New note"
          onCta={onNewNote}
          onOpenNote={onOpenNote}
          allHref="/notes"
        />
        <NoteListPanel
          title="Starred"
          icon={Star}
          notes={starred}
          emptyHint="Star a note to pin it here."
          ctaLabel={null}
          onOpenNote={onOpenNote}
          allHref="/notes"
        />
      </motion.div>

      <motion.div
        variants={bloom}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <FocusPanel todayFocusCount={todayFocusCount} />
        <ReviewPanel dueReviewCount={dueReviewCount} />
      </motion.div>
    </motion.div>
  );
}

function ClockHeader({ greeting }: { greeting: string }) {
  /* Tick the clock once per second client-side; render an SSR-safe placeholder
     until the first effect fires so we never hydrate-mismatch. */
  const [now, setNow] = useState<Date | null>(null);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const dateStr = now
    ? now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : " ";
  const timeStr = now
    ? now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : " ";

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-line-1">
      <div>
        <p className="text-text-4 text-xs tracking-widest uppercase mb-2">
          {dateStr}
        </p>
        <h1 className="font-serif text-text-1 text-4xl font-light tracking-tight">
          {greeting}
        </h1>
      </div>
      <p
        className="font-serif text-text-1 tabular-nums"
        style={{
          fontSize: "clamp(36px, 4vw, 56px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.02em",
        }}
        aria-label="Current time"
      >
        {timeStr}
      </p>
    </div>
  );
}

function NoteListPanel({
  title,
  icon: Icon,
  notes,
  emptyHint,
  ctaLabel,
  onCta,
  onOpenNote,
  allHref,
}: {
  title: string;
  icon: typeof Clock;
  notes: NoteListItem[];
  emptyHint: string;
  ctaLabel: string | null;
  onCta?: () => void;
  onOpenNote: (id: string) => void;
  allHref?: string;
}) {
  return (
    <Surface className="p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-text-3" />
          <h3 className="font-serif text-text-1 text-base font-medium">
            {title}
          </h3>
          <span className="text-text-4 text-xs tabular-nums ml-1">
            {notes.length}
          </span>
        </div>
        {allHref && notes.length > 0 && (
          <Link
            href={allHref}
            className="inline-flex items-center gap-1 text-text-3 hover:text-text-1 text-xs font-light transition-colors"
          >
            See all
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center gap-3">
          <p className="text-text-3 text-sm font-light">{emptyHint}</p>
          {ctaLabel && onCta && (
            <button
              onClick={onCta}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line-2 text-text-2 hover:text-text-1 hover:border-line-3 transition-colors text-xs font-medium"
            >
              <Plus className="w-3 h-3" />
              {ctaLabel}
            </button>
          )}
        </div>
      ) : (
        <ul className="flex flex-col">
          {notes.map((n, i) => (
            <li key={n.id}>
              <button
                onClick={() => onOpenNote(n.id)}
                className="group w-full flex items-center gap-3 py-2.5 text-left transition-colors hover:bg-vellum-2 -mx-2 px-2 rounded-md"
              >
                <span className="flex-1 min-w-0">
                  <span className="block font-serif text-text-1 text-sm font-light truncate">
                    {n.title || "Untitled"}
                  </span>
                  <span className="block text-text-4 text-xs font-light truncate mt-0.5">
                    {n.excerpt || "Empty"}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-text-4 text-xs shrink-0">
                  {n.starred && (
                    <Star className="w-3 h-3" fill="#f5d75e" stroke="#f5d75e" />
                  )}
                  <span>{n.updatedAt}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </button>
              {i < notes.length - 1 && (
                <div className="h-px bg-line-1" aria-hidden />
              )}
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}

function FocusPanel({ todayFocusCount }: { todayFocusCount: number }) {
  const target = FOCUS_DAILY_TARGET;
  const filled = Math.min(todayFocusCount, target);
  return (
    <Surface className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-3.5 h-3.5 text-[#5645d4]" />
          <h3 className="font-serif text-text-1 text-base font-medium">
            Focus today
          </h3>
        </div>
        <span className="text-text-4 text-xs tabular-nums">
          {todayFocusCount} / {target}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className="font-serif text-text-1 tabular-nums"
          style={{ fontSize: "44px", fontWeight: 600, lineHeight: 1 }}
        >
          {todayFocusCount}
        </span>
        <span className="text-text-3 text-sm font-light">
          {todayFocusCount === 1 ? "session" : "sessions"} logged
        </span>
      </div>

      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: Math.max(target, todayFocusCount) }).map(
          (_, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background:
                  i < filled
                    ? "linear-gradient(135deg, #5645d4 0%, #7b3ff2 100%)"
                    : "transparent",
                border: i < filled ? "none" : "1px solid var(--color-line-2)",
              }}
            />
          ),
        )}
      </div>

      <Link
        href="/focus"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-white text-xs font-medium w-fit"
        style={{
          background: "linear-gradient(135deg, #5645d4 0%, #7b3ff2 100%)",
          boxShadow: "0 4px 14px rgba(86,69,212,0.30)",
        }}
      >
        Start a session
        <ArrowRight className="w-3 h-3" />
      </Link>
    </Surface>
  );
}

function ReviewPanel({ dueReviewCount }: { dueReviewCount: number }) {
  const hasDue = dueReviewCount > 0;
  return (
    <Surface className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat2 className="w-3.5 h-3.5 text-[#1aae39]" />
          <h3 className="font-serif text-text-1 text-base font-medium">
            Review queue
          </h3>
        </div>
        <span className="text-text-4 text-xs tabular-nums">
          {hasDue ? "due now" : "all clear"}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className="font-serif text-text-1 tabular-nums"
          style={{ fontSize: "44px", fontWeight: 600, lineHeight: 1 }}
        >
          {dueReviewCount}
        </span>
        <span className="text-text-3 text-sm font-light">
          {dueReviewCount === 1 ? "card" : "cards"} due
        </span>
      </div>

      <p className="text-text-3 text-xs font-light leading-relaxed">
        {hasDue
          ? "Spaced repetition keeps recall sharp — clear the queue to extend the next review interval."
          : "Nothing due. Add cards from the Review tab or import a CSV of front/back pairs."}
      </p>

      <Link
        href="/review"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium w-fit border border-line-2 text-text-1 hover:bg-vellum-2 transition-colors"
      >
        {hasDue ? "Review now" : "Open review"}
        <ArrowRight className="w-3 h-3" />
      </Link>
    </Surface>
  );
}
