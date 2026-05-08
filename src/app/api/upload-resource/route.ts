import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_MIME = new Map<string, string>([
  ["application/pdf", "pdf"],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "docx",
  ],
  [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "pptx",
  ],
  ["application/msword", "doc"],
  ["application/vnd.ms-powerpoint", "ppt"],
]);

const ALLOWED_EXT = new Set(["pdf", "docx", "pptx", "doc", "ppt"]);
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

/** Strip path components and unsafe characters before persisting the filename. */
function safeBaseName(name: string): string {
  const base = name.replace(/\\/g, "/").split("/").pop() ?? "file";
  return base
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 120);
}

function niceTitleFrom(filename: string): string {
  return (filename.replace(/\.[^.]+$/, "") || "Document")
    .replace(/[_-]+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { message: "Invalid multipart form data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "No file uploaded." },
      { status: 400 },
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ message: "Empty file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "File too large (max 25 MB)." },
      { status: 413 },
    );
  }

  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const mimeOk = ALLOWED_MIME.has(file.type);
  const extOk = ALLOWED_EXT.has(ext);
  if (!mimeOk && !extOk) {
    return NextResponse.json(
      { message: "Unsupported file type. Use PDF, PPTX, or DOCX." },
      { status: 415 },
    );
  }

  const cleanedName = safeBaseName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

  const record = await prisma.upload.create({
    data: {
      userId,
      filename: cleanedName,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      data: bytes,
    },
    select: { id: true, filename: true, size: true },
  });

  return NextResponse.json({
    url: `/api/files/${record.id}`,
    title: niceTitleFrom(record.filename),
    sizeBytes: record.size,
    extension: ext || ALLOWED_MIME.get(file.type) || "bin",
  });
}
