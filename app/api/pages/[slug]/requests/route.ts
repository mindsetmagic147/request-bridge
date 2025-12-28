import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { slug: string };
};

export async function GET(
  _req: Request,
  { params }: Params
) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  });

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    pageId: page.id,
    requests: [],
  });
}
