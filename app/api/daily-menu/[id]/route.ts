import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const menu = await prisma.dailyMenu.update({
    where: { id: Number(id) },
    data: {
      items:     JSON.stringify(data.items ?? []),
      price:     data.price ?? null,
      note:      data.note ?? null,
      published: data.published ?? false,
    },
  });
  return NextResponse.json(menu);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.dailyMenu.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
