import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { fromDateString, toDateString, today } from "@/lib/dates";
import { LogShell } from "./LogShell";

export const dynamic = "force-dynamic";

export default async function LogPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date: dateStr } = await params;

  let date: Date;
  try {
    date = fromDateString(dateStr);
    if (Number.isNaN(date.getTime())) notFound();
  } catch {
    notFound();
  }

  const user = await requireUser();

  const [entry, recent] = await Promise.all([
    prisma.dailyLog.upsert({
      where: { userId_date: { userId: user.id, date } },
      create: { userId: user.id, date, content: "" },
      update: {},
    }),
    prisma.dailyLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(date.getTime() - 13 * 86400 * 1000),
          lte: today(),
        },
      },
      orderBy: { date: "desc" },
      select: { date: true, content: true },
    }),
  ]);

  return (
    <LogShell
      user={{
        name: user.name ?? user.email?.split("@")[0] ?? "You",
        email: user.email ?? "",
      }}
      dateString={toDateString(date)}
      entry={{
        content: entry.content,
        mood: entry.mood,
        energy: entry.energy,
      }}
      recent={recent.map((r) => ({
        dateString: toDateString(r.date),
        hasContent: r.content.trim().length > 0,
      }))}
    />
  );
}
