import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomUUID } from "crypto";

async function getClerkUserId(): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(`site-view:${ip}`)) {
      return NextResponse.json({ error: "יותר מדי בקשות" }, { status: 429 });
    }

    let viewerKey: string;

    const userId = await getClerkUserId();
    if (userId) {
      viewerKey = userId;
    } else {
      const cookie = req.cookies.get("visitor_id");
      if (cookie?.value) {
        viewerKey = cookie.value;
      } else {
        viewerKey = randomUUID();
      }
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await prisma.viewEvent.findFirst({
      where: {
        scope: "SITE",
        viewerKey,
        recipeId: null,
        createdAt: { gte: cutoff },
      },
    });

    if (!existing) {
      await prisma.viewEvent.create({
        data: { scope: "SITE", viewerKey, recipeId: null },
      });
    }

    const response = NextResponse.json({ ok: true });

    if (!userId && !req.cookies.get("visitor_id")) {
      response.cookies.set("visitor_id", viewerKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
