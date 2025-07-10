import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Simple session: set a cookie (mock for now)
  const res = NextResponse.json({ message: "Login successful", userId: user.id });
  res.cookies.set("userId", user.id, { path: "/", httpOnly: true });
  return res;
}