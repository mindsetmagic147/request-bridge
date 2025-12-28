import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
};

type RequestRow = {
  id: string;
  name: string;
  email: string | null;
  message: string;
  createdAt: Date;
};

export default async function DashboardPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = params.slug;
  const token = searchParams.token;

  if (!token) {
    notFound();
  }

  const page = await prisma.requestPage.findFirst({
    where: {
      slug,
      accessToken: token,
    },
    include: {
      requests: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!page) {
    notFound();
  }

  const requests = page.requests as RequestRow[];
  const isLocked = !page.isPaid && requests.length >= 25;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Request Inbox</h1>
          <p className="text-muted-foreground">
            This inbox is private. Only people with this link can see it.
          </p>
        </header>

        {/* 🔒 PAYWALL BANNER */}
        {isLocked && (
          <div className="rounded-md border border-red-200 bg-red-50 p-6 space-y-3">
            <h2 className="text-lg font-semibold text-red-700">
              🔒 Inbox locked
            </h2>
            <p className="text-sm text-red-700">
              You’ve reached the free limit of 25 requests.
              Upgrade to keep receiving new requests.
            </p>
            <button className="inline-flex rounded-md bg-black px-4 py-2 text-white text-sm font-medium">
              Upgrade for ₹499/month
            </button>
          </div>
        )}

        {/* Empty state */}
        {requests.length === 0 ? (
          <div className="rounded-md border p-10 text-center space-y-3">
            <h2 className="text-lg font-medium">No requests yet</h2>
            <p className="text-sm text-muted-foreground">
              When someone submits a request using your public link,
              it will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>

              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b last:border-0 align-top">
                    <td className="px-4 py-3 font-medium">{req.name}</td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {req.email || "—"}
                    </td>

                    <td className="px-4 py-3 max-w-md">
                      <details className="group">
                        <summary className="cursor-pointer list-none">
                          <span className="block line-clamp-2">
                            {req.message}
                          </span>
                          <span className="text-xs text-muted-foreground group-open:hidden">
                            Click to expand
                          </span>
                        </summary>
                        <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                          {req.message}
                        </div>
                      </details>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <form
                        action={`/api/pages/${slug}/requests/${req.id}?token=${token}`}
                        method="POST"
                      >
                        <input type="hidden" name="_method" value="DELETE" />
                        <button
                          type="submit"
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="text-sm text-muted-foreground">
          Tip: Bookmark this page. There is no account or password recovery.
        </footer>
      </div>
    </main>
  );
}
