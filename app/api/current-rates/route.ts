import { CountryInfo } from "@/lib/contryInfo";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  try {
    const rates = await prisma.currentRate.findMany();
    //const rateData: Record<string, number> = {};
    const rateData: Record<string, object> = {};

    let updatedDate = new Date();
    if (rates.length > 0) {
      updatedDate = rates[0].updatedAt;
    } else {
      updatedDate = new Date("19990101");
    }

    // 프로젝트 내에 있는 국가 정보에 있는것만 화면에 뿌려주자..
    // const countryList = Object.keys(CountryInfo);
    // for (const rate of rates) {
    //   if (countryList.includes(rate.currency)) {
    //     rateData[rate.currency] = rate.rate;
    //   }
    // }

    // 프로젝트 내에 있는 국가 정보에 있는것만 화면에 뿌려주자..
    const countryList = Object.keys(CountryInfo);
    for (const rate of rates) {
      if (countryList.includes(rate.currency)) {
        rateData[rate.currency] = {
          rate: rate.rate,
          names: CountryInfo[rate.currency].names,
          unit: CountryInfo[rate.currency].unit,
        };
      }
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
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
  const EXTERNAL_API = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/KRW`;

  try {
    const res = await fetch(EXTERNAL_API);
    if (!res.ok) throw new Error("외부 환율 API 호출에 실패");

    const json = await res.json();
    const rates: Record<string, number> = json.conversion_rates;

    console.log(rates);

    //DB에 insert 하자.
    const entries = Object.entries(rates);
    // for (const [currency, rate] of entries) {
    //   await prisma.currentRate.upsert({
    //     where: { currency },
    //     update: { rate },
    //     create: { currency, rate },
    //   });
    // }
    const chunkSize = 10;
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      const operations = chunk.map(([currency, rate]) =>
        prisma.currentRate.upsert({
          where: { currency },
          update: { rate },
          create: { currency, rate },
        })
      );
      await Promise.all(operations);
      // 💡 너무 빠르게 보내면 Supabase가 뻗음 → 살짝 쉬어줌
      await delay(200);
    }

    // const operations = entries.map(([currency, rate]) =>
    //   prisma.currentRate.upsert({
    //     where: { currency },
    //     update: { rate },
    //     create: { currency, rate },
    //   })
    // );
    // console.log(operations);

    return NextResponse.json({ success: true, count: entries.length });
  } catch (err) {
    console.error("실시간 환율 저장에 실패했습니다.", err);
    return new NextResponse("실시간 환율 저장에 실패했습니다.", {
      status: 500,
    });
  }
}
