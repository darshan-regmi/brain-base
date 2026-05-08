import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { today, toDateString } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function LogIndex() {
  const user = await requireUser();
  const date = today();

  // Auto-create today's entry on first visit
  await prisma.dailyLog.upsert({
    where: { userId_date: { userId: user.id, date } },
    create: { userId: user.id, date, content: "" },
    update: {},
  });

  redirect(`/log/${toDateString(date)}`);
}
