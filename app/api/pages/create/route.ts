import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
  try {
    const slug = `page-${crypto.randomBytes(4).toString("hex")}`;
    const accessToken = crypto.randomBytes(16).toString("hex");

    const page = await prisma.requestPage.create({
      data: {
        slug,
        accessToken,
      },
      select: {
        slug: true,
        accessToken: true,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("PAGE CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
