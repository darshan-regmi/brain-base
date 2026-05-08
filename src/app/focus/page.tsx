import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { FocusShell } from "./FocusShell";

export const dynamic = "force-dynamic";

export default async function FocusPage() {
  const user = await requireUser();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todaySessions = await prisma.focusSession.findMany({
    where: {
      userId: user.id,
      kind: "FOCUS",
      completed: true,
      startedAt: { gte: startOfToday },
    },
    orderBy: { startedAt: "asc" },
  });

  return (
    <FocusShell
      user={{
        name: user.name ?? user.email?.split("@")[0] ?? "You",
        email: user.email ?? "",
      }}
      initialTodayCount={todaySessions.length}
    />
  );
}
