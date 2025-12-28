import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
  const slug = crypto.randomBytes(4).toString("hex");
  const accessToken = crypto.randomBytes(16).toString("hex");

  const page = await prisma.page.create({
    data: {
      slug,
      accessToken,
    },
  });

  return NextResponse.json({
    slug: page.slug,
    accessToken: page.accessToken,
  });
}
