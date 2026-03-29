import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const items = await prisma.menuItem.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const item = await prisma.menuItem.create({
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
  return NextResponse.json(item, { status: 201 });
}
