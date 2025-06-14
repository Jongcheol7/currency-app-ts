import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rates = await prisma.currentRate.findMany();
    const rateData: Record<string, number> = {};

    const updatedDate = rates[0].updatedAt;
    for (const rate of rates) {
      rateData[rate.currency] = rate.rate;
    }

    console.log("조회용 data : ", rateData);

    return NextResponse.json({ rateData, updatedDate });
  } catch (err) {
    console.error("실시간 환율 조회에 실패했습니다.", err);
    return new NextResponse("실시간 환율 조회에 실패했습니다.", {
      status: 404,
    });
  }
}

export async function POST() {
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  const EXTERNAL_API = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/KRW`;

  try {
    const res = await fetch(EXTERNAL_API);
    if (!res.ok) throw new Error("외부 환율 API 호출에 실패");

    const json = await res.json();
    const rates: Record<string, number> = json.conversion_rates;

    //DB에 insert 하자.
    const entries = Object.entries(rates);
    for (const [currency, rate] of entries) {
      await prisma.currentRate.upsert({
        where: { currency },
        update: { rate },
        create: { currency, rate },
      });
    }

    return NextResponse.json({ success: true, count: entries.length });
  } catch (err) {
    console.error("실시간 환율 저장에 실패했습니다.", err);
    return new NextResponse("실시간 환율 저장에 실패했습니다.", {
      status: 500,
    });
  }
}
