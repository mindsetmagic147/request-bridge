"use client";

import { useEffect, useState } from "react";

export default function PublicRequestClient({ slug }: { slug: string }) {
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Honeypot MUST be called "website"
  const [website, setWebsite] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      formData.append("website", website); // 🪤 honeypot

      const res = await fetch("/api/requests/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setSubmitted(true);
    } catch {
      setError("Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-semibold">Request sent</h1>
          <p className="text-muted-foreground">
            Your message has been delivered.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Send a Request</h1>
          <p className="text-muted-foreground">
            Fill out the form below. Your message will be sent privately.
          </p>
        </header>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Honeypot — invisible to humans */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-black px-6 py-3 text-white font-medium disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send Request"}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          This form sends one message. No account required.
        </p>
      </form>
    </main>
  );
}
