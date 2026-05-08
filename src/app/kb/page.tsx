import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { listAllTags } from "@/lib/notes";
import { KbShell } from "./KbShell";

export const dynamic = "force-dynamic";

export default async function KbPage() {
  const user = await requireUser();

  const [notes, links, tags] = await Promise.all([
    prisma.note.findMany({
      where: { userId: user.id, archived: false },
      include: { tags: { include: { tag: true } } },
      orderBy: { title: "asc" },
    }),
    prisma.noteLink.findMany({
      where: { source: { userId: user.id } },
      select: { sourceId: true, targetId: true },
    }),
    listAllTags(user.id),
  ]);

  return (
    <KbShell
      user={{
        name: user.name ?? user.email?.split("@")[0] ?? "You",
        email: user.email ?? "",
      }}
      notes={notes.map((n) => ({
        id: n.id,
        title: n.title || "Untitled",
        tags: n.tags.map((nt) => nt.tag.name),
      }))}
      links={links.map((l) => ({ source: l.sourceId, target: l.targetId }))}
      tags={tags}
    />
  );
}
