import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
  const page = await prisma.page.create({
    data: {
      slug: crypto.randomBytes(4).toString("hex"),
      accessToken: crypto.randomBytes(16).toString("hex"),
    },
  });

  return NextResponse.json({
    slug: page.slug,
    accessToken: page.accessToken,
  });
}
