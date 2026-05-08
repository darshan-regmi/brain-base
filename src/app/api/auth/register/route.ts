import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const raw = (await req.json().catch(() => null)) as
      | { name?: unknown; email?: unknown; password?: unknown }
      | null;

    const name = typeof raw?.name === "string" ? raw.name.trim() : "";
    const email =
      typeof raw?.email === "string" ? raw.email.trim().toLowerCase() : "";
    const password = typeof raw?.password === "string" ? raw.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }
    if (name.length > 80) {
      return NextResponse.json(
        { message: "Name is too long (max 80 characters)." },
        { status: 400 },
      );
    }
    if (!EMAIL_RX.test(email) || email.length > 254) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }
    if (password.length > 200) {
      return NextResponse.json(
        { message: "Password is too long (max 200 characters)." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true },
    });

    return NextResponse.json(
      { message: "Account created.", userId: user.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
