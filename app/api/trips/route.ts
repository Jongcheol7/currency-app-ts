import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 여행 목록 조회
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: { expenses: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(trips);
}

// 여행 추가
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, currency, startDate, endDate } = await req.json();

  const trip = await prisma.trip.create({
    data: {
      userId: session.user.id,
      name,
      currency,
      startDate,
      endDate,
    },
  });

  return NextResponse.json(trip);
}

// 여행 수정
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...updates } = await req.json();

  const trip = await prisma.trip.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!trip) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { name, currency, startDate, endDate } = updates;
  const updated = await prisma.trip.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(currency !== undefined && { currency }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
    },
  });

  return NextResponse.json(updated);
}

// 여행 삭제
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  // 본인 여행만 삭제 가능
  const trip = await prisma.trip.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!trip) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.trip.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
