import { requireUser } from "@/lib/auth-helpers";
import { listNotes, listAllTags } from "@/lib/notes";
import { NotesShell } from "./NotesShell";

export const dynamic = "force-dynamic";

export default async function NotesIndexPage() {
  const user = await requireUser();
  const [notes, archivedNotes, tags] = await Promise.all([
    listNotes(user.id),
    listNotes(user.id, { archived: true }),
    listAllTags(user.id),
  ]);

  return (
    <NotesShell
      user={{
        name: user.name ?? user.email?.split("@")[0] ?? "You",
        email: user.email ?? "",
      }}
      initialNotes={notes}
      archivedNotes={archivedNotes}
      tags={tags}
    />
  );
}
