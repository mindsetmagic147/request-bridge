"use client";

import { useState } from "react";

type Result = {
  slug: string;
  accessToken: string;
};

export default function CreatePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/pages/create", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to create page");
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const publicLink = `${window.location.origin}/p/${result.slug}`;
    const privateLink = `${window.location.origin}/dashboard/${result.slug}?token=${result.accessToken}`;

    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-xl w-full space-y-10">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold">
              Your request page is ready
            </h1>
            <p className="text-muted-foreground">
              You now have one public link and one private inbox.
            </p>
          </header>

          {/* Public link */}
          <section className="space-y-3 rounded-md border p-4">
            <h2 className="font-medium">🌍 Public request link</h2>
            <p className="text-sm text-muted-foreground">
              Share this link anywhere. Anyone with this link can send you a
              request.
            </p>

            <div className="flex gap-2">
              <input
                readOnly
                value={publicLink}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(publicLink)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Copy
              </button>
            </div>
          </section>

          {/* Private link */}
          <section className="space-y-3 rounded-md border p-4">
            <h2 className="font-medium">🔒 Private inbox link</h2>
            <p className="text-sm text-muted-foreground">
              This link gives full access to your inbox. Anyone with this link
              can read your messages.
            </p>

            <div className="flex gap-2">
              <input
                readOnly
                value={privateLink}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(privateLink)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Copy
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Save or bookmark this link. There is no password recovery.
            </p>
          </section>

          {/* Done */}
          <section className="pt-4">
            <a
              href={privateLink}
              className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-white text-base font-medium hover:bg-black/90"
            >
              Go to inbox
            </a>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold">
            Create a request page
          </h1>
          <p className="text-muted-foreground">
            This creates a public page for receiving requests and a private
            inbox for reading them.
          </p>
        </header>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full rounded-md bg-black px-6 py-3 text-white text-base font-medium hover:bg-black/90 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create my page"}
        </button>

        <p className="text-sm text-muted-foreground">
          No sign-up required. Takes less than a minute.
        </p>
      </div>
    </main>
  );
}
