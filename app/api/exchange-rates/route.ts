import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const target = searchParams.get("target") || "USD";
  const days = Math.min(Number(searchParams.get("days")) || 90, 365);

  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  try {
    const rates = await prisma.exchangeRate.findMany({
      where: {
        base: "KRW",
        target,
        date: { gte: since },
      },
      orderBy: { date: "asc" },
      select: { date: true, rate: true },
    });

    return NextResponse.json(rates);
  } catch (err) {
    console.error("환율 히스토리 조회 실패:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
