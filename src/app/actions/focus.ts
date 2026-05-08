"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export async function logFocusSession(input: {
  kind: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
  durationSec: number;
  completed: boolean;
}) {
  const user = await requireUser();
  await prisma.focusSession.create({
    data: {
      userId: user.id,
      kind: input.kind,
      durationSec: input.durationSec,
      completed: input.completed,
    },
  });
  revalidatePath("/focus");
}
