"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export async function updateProfile(input: {
  name?: string;
}): Promise<{ ok: boolean; message?: string; name?: string }> {
  const user = await requireUser();

  const name = (input.name ?? "").trim();
  if (name.length === 0) {
    return { ok: false, message: "Name can't be empty." };
  }
  if (name.length > 80) {
    return { ok: false, message: "Name is too long (max 80 chars)." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  revalidatePath("/dashboard");
  revalidatePath("/focus");
  revalidatePath("/notes");
  revalidatePath("/log");
  revalidatePath("/learn");
  revalidatePath("/review");
  revalidatePath("/kb");
  return { ok: true, name };
}
