import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Stream a previously uploaded document. The owner is the only viewer — we
 *  never serve another user's bytes, even if they guess the cuid. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const upload = await prisma.upload.findFirst({
    where: { id, userId },
    select: { filename: true, mimeType: true, data: true, size: true },
  });

  if (!upload) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const body = new Uint8Array(upload.data);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": upload.mimeType || "application/octet-stream",
      "Content-Length": String(upload.size),
      "Content-Disposition": `inline; filename="${upload.filename}"`,
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}
