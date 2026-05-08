import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { ReviewShell } from "./ReviewShell";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const user = await requireUser();
  const now = new Date();

  const [due, total] = await Promise.all([
    prisma.reviewCard.findMany({
      where: { userId: user.id, dueAt: { lte: now } },
      orderBy: { dueAt: "asc" },
      take: 50,
    }),
    prisma.reviewCard.count({ where: { userId: user.id } }),
  ]);

  return (
    <ReviewShell
      user={{
        name: user.name ?? user.email?.split("@")[0] ?? "You",
        email: user.email ?? "",
      }}
      queue={due.map((c) => ({ id: c.id, front: c.front, back: c.back }))}
      totalCards={total}
    />
  );
}
