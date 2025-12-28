import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_FREE_REQUESTS = 25;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const slug = formData.get("slug")?.toString();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const message = formData.get("message")?.toString();
    const website = formData.get("website")?.toString(); // honeypot

    // Honeypot → silently ignore
    if (website) {
      return NextResponse.json({}, { status: 204 });
    }

    if (!slug || !name || !message) {
      return NextResponse.json({}, { status: 400 });
    }

    const page = await prisma.requestPage.findUnique({
      where: { slug },
      include: { requests: true },
    });

    if (!page) {
      return NextResponse.json({}, { status: 204 });
    }

    // 🔒 PAYWALL: block after 25 if not paid
    if (!page.isPaid && page.requests.length >= MAX_FREE_REQUESTS) {
      return NextResponse.json({}, { status: 204 });
    }

    await prisma.request.create({
      data: {
        name,
        email: email || null,
        message,
        pageId: page.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REQUEST CREATE ERROR:", error);
    return NextResponse.json({}, { status: 204 });
  }
}
