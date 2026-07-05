"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="bg-[#1a1a1a] py-20 px-6 md:px-12 text-white text-center">
      <h2
        className="text-2xl md:text-4xl font-semibold max-w-lg mx-auto mb-8 leading-snug"
        style={{ fontFamily: "var(--font-nohemi)" }}
      >
        Sign up to get brief updates – new colors, sizes, and styles straight to your inbox.
      </h2>

      {status === "success" ? (
        <p className="text-sm text-emerald-400 font-medium">You&apos;re subscribed! Watch your inbox.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-sm mx-auto">
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm px-5 py-3 rounded-full outline-none focus:border-white/60 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-white text-black text-sm px-6 py-3 rounded-full hover:bg-gray-100 transition-colors shrink-0 disabled:opacity-50"
          >
            {status === "loading" ? "Sending…" : "Send"}
          </button>
        </form>
      )}
      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
    </section>
  );
}
