"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

type ResourceKind = "READING" | "COURSE" | "WATCHING";
type ResourceStatus = "QUEUED" | "ACTIVE" | "PAUSED" | "DONE";

export async function createResource(input: {
  title: string;
  kind?: ResourceKind;
  source?: string;
  url?: string;
}) {
  const user = await requireUser();
  await prisma.resource.create({
    data: {
      userId: user.id,
      title: input.title,
      kind: input.kind ?? "READING",
      source: input.source,
      url: input.url,
    },
  });
  revalidatePath("/learn");
}

export async function updateResource(
  id: string,
  data: Partial<{
    title: string;
    progress: number;
    status: ResourceStatus;
    takeaways: string;
    nowReading: boolean;
  }>,
) {
  const user = await requireUser();

  if (data.nowReading === true) {
    await prisma.resource.updateMany({
      where: { userId: user.id, nowReading: true },
      data: { nowReading: false },
    });
  }

  await prisma.resource.update({
    where: { id, userId: user.id },
    data,
  });
  revalidatePath("/learn");
}

export async function deleteResource(id: string) {
  const user = await requireUser();
  await prisma.resource.delete({ where: { id, userId: user.id } });
  revalidatePath("/learn");
}
