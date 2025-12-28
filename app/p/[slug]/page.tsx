import PublicRequestClient from "./public-request-client";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <PublicRequestClient slug={slug} />;
}
