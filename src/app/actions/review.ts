"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { review } from "@/lib/sm2";

export async function createCard(input: {
  front: string;
  back: string;
  noteId?: string | null;
}) {
  const user = await requireUser();
  await prisma.reviewCard.create({
    data: {
      userId: user.id,
      front: input.front,
      back: input.back,
      noteId: input.noteId ?? null,
    },
  });
  revalidatePath("/review");
}

export async function bulkCreateCards(
  cards: { front: string; back: string }[],
): Promise<{ created: number }> {
  const user = await requireUser();
  const cleaned = cards
    .map((c) => ({ front: c.front.trim(), back: c.back.trim() }))
    .filter((c) => c.front.length > 0 && c.back.length > 0);

  if (cleaned.length === 0) return { created: 0 };

  await prisma.reviewCard.createMany({
    data: cleaned.map((c) => ({
      userId: user.id,
      front: c.front,
      back: c.back,
    })),
  });
  revalidatePath("/review");
  return { created: cleaned.length };
}

export async function deleteCard(id: string) {
  const user = await requireUser();
  await prisma.reviewCard.delete({ where: { id, userId: user.id } });
  revalidatePath("/review");
}

export async function reviewCard(id: string, quality: number) {
  const user = await requireUser();
  const card = await prisma.reviewCard.findFirst({
    where: { id, userId: user.id },
  });
  if (!card) return;

  const next = review(
    {
      ease: card.ease,
      interval: card.interval,
      repetitions: card.repetitions,
    },
    quality,
  );

  const dueAt = new Date(Date.now() + next.interval * 24 * 60 * 60 * 1000);

  await prisma.reviewCard.update({
    where: { id },
    data: {
      ease: next.ease,
      interval: next.interval,
      repetitions: next.repetitions,
      dueAt,
    },
  });
  revalidatePath("/review");
}
