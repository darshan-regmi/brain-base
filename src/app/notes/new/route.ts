import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }
  const note = await prisma.note.create({
    data: { userId: session.user.id, title: "", content: "" },
  });
  return NextResponse.redirect(new URL(`/notes/${note.id}`, origin));
}
