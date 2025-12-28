// app/api/pages/[slug]/requests/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: Request, { params }: Params) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit") ?? 10);
  const q = searchParams.get("q");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await prisma.requestPage.findUnique({
    where: { slug },
    select: { id: true, accessToken: true },
  });

  if (!page || page.accessToken !== token) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const requests = await prisma.request.findMany({
    where: {
      page: { id: page.id },
      ...(q && {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  let nextCursor: string | null = null;
  if (requests.length > limit) {
    nextCursor = requests.pop()!.id;
  }

  return NextResponse.json({
    requests,
    nextCursor,
  });
}
