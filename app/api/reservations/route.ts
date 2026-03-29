import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reservations = await prisma.reservation.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(reservations);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const reservation = await prisma.reservation.create({
    data: {
      firstName: data.firstName,
      lastName:  data.lastName,
      phone:     data.phone,
      date:      data.date,
      time:      data.time,
      guests:    Number(data.guests),
      occasion:  data.occasion ?? null,
      note:      data.note ?? null,
      status:    "pending",
    },
  });
  return NextResponse.json(reservation, { status: 201 });
}
