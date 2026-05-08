"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { syncWikilinks } from "@/lib/wikilinks";

export async function createNote() {
  const user = await requireUser();
  const note = await prisma.note.create({
    data: { userId: user.id, title: "", content: "" },
  });
  revalidatePath("/dashboard");
  redirect(`/notes/${note.id}`);
}

export async function updateNote(
  noteId: string,
  data: { title?: string; content?: string },
) {
  const user = await requireUser();

  await prisma.note.update({
    where: { id: noteId, userId: user.id },
    data,
  });

  if (data.content !== undefined) {
    await syncWikilinks(user.id, noteId, data.content);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/kb");
}

export async function toggleStar(noteId: string) {
  const user = await requireUser();
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: user.id },
    select: { starred: true },
  });
  if (!note) return;
  await prisma.note.update({
    where: { id: noteId },
    data: { starred: !note.starred },
  });
  revalidatePath("/dashboard");
  revalidatePath(`/notes/${noteId}`);
}

export async function archiveNote(noteId: string) {
  const user = await requireUser();
  await prisma.note.update({
    where: { id: noteId, userId: user.id },
    data: { archived: true },
  });
  revalidatePath("/dashboard");
}

export async function restoreNote(noteId: string) {
  const user = await requireUser();
  await prisma.note.update({
    where: { id: noteId, userId: user.id },
    data: { archived: false },
  });
  revalidatePath("/dashboard");
}

export async function deleteNoteForever(noteId: string) {
  const user = await requireUser();
  await prisma.note.delete({
    where: { id: noteId, userId: user.id },
  });
  revalidatePath("/dashboard");
}

export async function emptyTrash() {
  const user = await requireUser();
  await prisma.note.deleteMany({
    where: { userId: user.id, archived: true },
  });
  revalidatePath("/dashboard");
}

export async function setTags(noteId: string, tagNames: string[]) {
  const user = await requireUser();

  const cleaned = [...new Set(tagNames.map((t) => t.trim().toLowerCase()).filter(Boolean))];

  await prisma.$transaction(async (tx) => {
    for (const name of cleaned) {
      await tx.tag.upsert({
        where: { userId_name: { userId: user.id, name } },
        update: {},
        create: { userId: user.id, name },
      });
    }

    const tags = await tx.tag.findMany({
      where: { userId: user.id, name: { in: cleaned } },
    });

    await tx.noteTag.deleteMany({ where: { noteId } });
    await tx.noteTag.createMany({
      data: tags.map((t) => ({ noteId, tagId: t.id })),
    });
  });

  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/dashboard");
}
