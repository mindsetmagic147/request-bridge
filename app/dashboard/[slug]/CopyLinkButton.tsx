"use client";

export default function CopyLinkButton({ url }: { url: string }) {
  async function copy() {
    await navigator.clipboard.writeText(url);
    alert("Dashboard link copied");
  }

  return (
    <button
      onClick={copy}
      style={{
        padding: "8px 12px",
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Copy dashboard link
    </button>
  );
}
