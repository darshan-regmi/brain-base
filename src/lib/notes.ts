import { prisma } from "@/lib/prisma";
import { relativeTime } from "@/lib/dates";

export interface NoteListItem {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: string;
  starred: boolean;
  wordCount: number;
}

function excerpt(content: string, max = 220): string {
  const stripped = content.replace(/\s+/g, " ").trim();
  if (stripped.length <= max) return stripped;
  return stripped.slice(0, max).trimEnd() + "…";
}

function countWords(s: string): number {
  if (!s.trim()) return 0;
  return s.trim().split(/\s+/).length;
}

export async function listNotes(
  userId: string,
  opts: { starred?: boolean; tag?: string; archived?: boolean } = {},
): Promise<NoteListItem[]> {
  const notes = await prisma.note.findMany({
    where: {
      userId,
      archived: opts.archived ?? false,
      starred: opts.starred,
      ...(opts.tag
        ? { tags: { some: { tag: { name: opts.tag } } } }
        : {}),
    },
    include: { tags: { include: { tag: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return notes.map((n) => ({
    id: n.id,
    title: n.title || "Untitled",
    excerpt: excerpt(n.content),
    tags: n.tags.map((nt) => nt.tag.name),
    updatedAt: relativeTime(n.updatedAt),
    starred: n.starred,
    wordCount: countWords(n.content),
  }));
}

export async function getNote(userId: string, noteId: string) {
  return prisma.note.findFirst({
    where: { id: noteId, userId },
    include: { tags: { include: { tag: true } } },
  });
}

export async function listAllTags(userId: string): Promise<string[]> {
  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
  return tags.map((t) => t.name);
}

export interface DashboardStats {
  notes: number;
  notesDelta: string;
  words: string;
  wordsDelta: string;
  streak: number;
  streakLabel: string;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [allNotes, recentNotes, recentLogs] = await Promise.all([
    prisma.note.findMany({
      where: { userId, archived: false },
      select: { content: true, updatedAt: true },
    }),
    prisma.note.count({
      where: { userId, archived: false, createdAt: { gte: oneWeekAgo } },
    }),
    prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      select: { date: true },
      take: 365,
    }),
  ]);

  const totalWords = allNotes.reduce((sum, n) => sum + countWords(n.content), 0);
  const todayWords = allNotes
    .filter((n) => n.updatedAt >= oneDayAgo)
    .reduce((sum, n) => sum + countWords(n.content), 0);

  // Streak: consecutive days back from today with a daily log
  let streak = 0;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const cursor = new Date(today);
  const logSet = new Set(
    recentLogs.map((l) => {
      const d = new Date(l.date);
      d.setUTCHours(0, 0, 0, 0);
      return d.getTime();
    }),
  );
  while (logSet.has(cursor.getTime())) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return {
    notes: allNotes.length,
    notesDelta: recentNotes > 0 ? `+${recentNotes} this week` : "Quiet week",
    words: formatWords(totalWords),
    wordsDelta: todayWords > 0 ? `+${formatWords(todayWords)} today` : "—",
    streak,
    streakLabel: streak === 0 ? "Start one today" : streak < 7 ? "Building" : "On fire",
  };
}

function formatWords(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
