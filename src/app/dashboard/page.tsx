import { requireUser } from "@/lib/auth-helpers";
import { listNotes, getDashboardStats } from "@/lib/notes";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "./DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  /* The overview shows the 5 most recent notes and the 5 most recent starred
     notes — fetch both small slices in parallel rather than pulling the full
     library back to the client. */
  const [notes, starred, stats, dueReviewCount, todayFocusCount] =
    await Promise.all([
      listNotes(user.id),
      listNotes(user.id, { starred: true }),
      getDashboardStats(user.id),
      prisma.reviewCard.count({
        where: { userId: user.id, dueAt: { lte: new Date() } },
      }),
      prisma.focusSession.count({
        where: {
          userId: user.id,
          kind: "FOCUS",
          completed: true,
          startedAt: { gte: startOfDay },
        },
      }),
    ]);

  return (
    <DashboardShell
      user={{
        name: user.name ?? user.email?.split("@")[0] ?? "You",
        email: user.email ?? "",
      }}
      stats={stats}
      recentNotes={notes.slice(0, 5)}
      starredNotes={starred.slice(0, 5)}
      dueReviewCount={dueReviewCount}
      todayFocusCount={todayFocusCount}
    />
  );
}
