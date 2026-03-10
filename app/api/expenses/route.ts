import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 지출 추가
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId, date, amount, category, memo } = await req.json();

  // 본인 여행인지 확인
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user.id },
  });
  if (!trip) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const expense = await prisma.expense.create({
    data: { tripId, date, amount, category, memo: memo || "" },
  });

  return NextResponse.json(expense);
}

// 지출 수정 (위치, 사진 등)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...updates } = await req.json();

  // 본인 지출인지 확인
  const expense = await prisma.expense.findFirst({
    where: { id, trip: { userId: session.user.id } },
  });
  if (!expense) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.expense.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json(updated);
}

// 지출 삭제
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const expense = await prisma.expense.findFirst({
    where: { id, trip: { userId: session.user.id } },
  });
  if (!expense) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.expense.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
