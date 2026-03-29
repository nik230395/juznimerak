import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const menus = await prisma.dailyMenu.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(menus);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const menu = await prisma.dailyMenu.upsert({
    where: { date: data.date },
    update: {
      items:     JSON.stringify(data.items ?? []),
      price:     data.price ?? null,
      note:      data.note ?? null,
      published: data.published ?? false,
    },
    create: {
      date:      data.date,
      items:     JSON.stringify(data.items ?? []),
      price:     data.price ?? null,
      note:      data.note ?? null,
      published: data.published ?? false,
    },
  });
  return NextResponse.json(menu, { status: 201 });
}
