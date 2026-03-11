import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { isDark, language, cardCount, selectedCurrencies } = body;

  const settings = await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: {
      ...(isDark !== undefined && { isDark }),
      ...(language !== undefined && { language }),
      ...(cardCount !== undefined && { cardCount }),
      ...(selectedCurrencies !== undefined && { selectedCurrencies }),
    },
    create: {
      userId: session.user.id,
      isDark: isDark ?? false,
      language: language ?? "ko",
      cardCount: cardCount ?? 4,
      selectedCurrencies: selectedCurrencies ?? ["KRW", "USD", "VND", "JPY"],
    },
  });

  return NextResponse.json(settings);
}
