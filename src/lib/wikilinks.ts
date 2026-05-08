import { prisma } from "@/lib/prisma";

const WIKILINK = /\[\[([^\]\n]+)\]\]/g;

/** Extract wikilink targets (note titles) from markdown content. */
export function extractLinks(content: string): string[] {
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = WIKILINK.exec(content))) {
    out.add(m[1].trim());
  }
  return [...out];
}

/** Sync NoteLink rows for a note based on its content. */
export async function syncWikilinks(userId: string, sourceId: string, content: string) {
  const titles = extractLinks(content);

  const targets = titles.length
    ? await prisma.note.findMany({
        where: { userId, title: { in: titles } },
        select: { id: true },
      })
    : [];

  await prisma.$transaction([
    prisma.noteLink.deleteMany({ where: { sourceId } }),
    ...targets
      .filter((t) => t.id !== sourceId)
      .map((t) =>
        prisma.noteLink.create({
          data: { sourceId, targetId: t.id },
        }),
      ),
  ]);
}
