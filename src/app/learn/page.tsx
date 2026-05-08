import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { LearnShell } from "./LearnShell";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const user = await requireUser();
  const resources = await prisma.resource.findMany({
    where: { userId: user.id },
    orderBy: [{ nowReading: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <LearnShell
      user={{
        name: user.name ?? user.email?.split("@")[0] ?? "You",
        email: user.email ?? "",
      }}
      resources={resources.map((r) => ({
        id: r.id,
        title: r.title,
        source: r.source ?? "",
        url: r.url ?? "",
        coverUrl: r.coverUrl ?? "",
        kind: r.kind,
        status: r.status,
        progress: r.progress,
        takeaways: r.takeaways,
        nowReading: r.nowReading,
      }))}
    />
  );
}
