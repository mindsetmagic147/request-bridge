// app/api/pages/[slug]/requests/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ slug: string; id: string }>;
};

export async function DELETE(req: Request, { params }: Params) {
  const { slug, id } = await params;

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!slug || !id || !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await prisma.requestPage.findUnique({
    where: { slug },
    select: { id: true, accessToken: true },
  });

  if (!page || page.accessToken !== token) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.request.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
