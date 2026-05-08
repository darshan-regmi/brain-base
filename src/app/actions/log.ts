"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { fromDateString, today } from "@/lib/dates";

export async function upsertDailyLog(
  dateString: string,
  data: { content?: string; mood?: number | null; energy?: number | null },
) {
  const user = await requireUser();
  const date = dateString === "today" ? today() : fromDateString(dateString);

  await prisma.dailyLog.upsert({
    where: { userId_date: { userId: user.id, date } },
    create: {
      userId: user.id,
      date,
      content: data.content ?? "",
      mood: data.mood ?? null,
      energy: data.energy ?? null,
    },
    update: data,
  });
  revalidatePath("/log");
  revalidatePath(`/log/${dateString}`);
}
