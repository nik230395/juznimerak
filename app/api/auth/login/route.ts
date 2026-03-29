import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Unesite korisničko ime i lozinku." }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    return NextResponse.json({ error: "Pogrešno korisničko ime ili lozinka." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Pogrešno korisničko ime ili lozinka." }, { status: 401 });
  }

  const token = await signToken({ id: admin.id, username: admin.username });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
