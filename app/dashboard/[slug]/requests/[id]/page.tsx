// app/dashboard/[slug]/requests/[id]/page.tsx

import { notFound } from "next/navigation";

type RequestItem = {
  id: string;
  name: string;
  email: string | null;
  message: string;
  createdAt: string;
};

type ApiResponse = {
  requests: RequestItem[];
};

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function RequestDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug, id } = await params;
  const { token } = await searchParams;

  if (!slug || !id || !token) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const apiUrl = new URL(
    `/api/pages/${slug}/requests`,
    baseUrl
  );
  apiUrl.searchParams.set("token", token);
  apiUrl.searchParams.set("limit", "100");

  const res = await fetch(apiUrl.toString(), { cache: "no-store" });
  if (!res.ok) notFound();

  const data: ApiResponse = await res.json();
  const request = data.requests.find((r) => r.id === id);

  if (!request) notFound();

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <a href={`/dashboard/${slug}?token=${token}`}>← Back to inbox</a>

      <h1 style={{ marginTop: 20 }}>Request</h1>

      <p>
        <strong>Name:</strong> {request.name}
      </p>

      {request.email && (
        <p>
          <strong>Email:</strong> {request.email}
        </p>
      )}

      <p>
        <strong>Submitted:</strong>{" "}
        {new Date(request.createdAt).toLocaleString()}
      </p>

      <hr style={{ margin: "20px 0" }} />

      <p>{request.message}</p>
    </main>
  );
}
