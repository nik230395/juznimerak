import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const item = await prisma.menuItem.update({
    where: { id: Number(id) },
    data: {
      category:  data.category,
      name:      data.name,
      subtitle:  data.subtitle ?? null,
      price:     data.price,
      allergens: data.allergens ?? null,
      available: data.available ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.menuItem.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
