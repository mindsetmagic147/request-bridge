import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    slug: string;
    id: string;
  };
};

export async function GET(
  _req: Request,
  { params }: Params
) {
  const { slug, id } = params;

  const page = await prisma.page.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // Request table not implemented yet
  return NextResponse.json({
    requestId: id,
    pageId: page.id,
  });
}
