import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { getNote, listAllTags } from "@/lib/notes";
import { prisma } from "@/lib/prisma";
import { NoteEditor } from "./NoteEditor";

export const dynamic = "force-dynamic";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const [note, allTags, backlinks] = await Promise.all([
    getNote(user.id, id),
    listAllTags(user.id),
    prisma.noteLink.findMany({
      where: { targetId: id, source: { userId: user.id } },
      include: {
        source: { select: { id: true, title: true, updatedAt: true } },
      },
    }),
  ]);

  if (!note) notFound();

  return (
    <NoteEditor
      user={{
        name: user.name ?? user.email?.split("@")[0] ?? "You",
        email: user.email ?? "",
      }}
      note={{
        id: note.id,
        title: note.title,
        content: note.content,
        starred: note.starred,
        tags: note.tags.map((t) => t.tag.name),
        updatedAt: note.updatedAt.toISOString(),
      }}
      allTags={allTags}
      backlinks={backlinks.map((bl) => ({
        id: bl.source.id,
        title: bl.source.title || "Untitled",
      }))}
    />
  );
}
