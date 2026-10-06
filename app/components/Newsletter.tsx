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
    <section className="px-6 md:px-16 lg:px-28 max-w-[1440px] mx-auto w-full">
      <div className="rounded-md bg-[#f3f1ed] px-6 py-14 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Get first look at new drops</h2>

        {status === "success" ? (
          <p className="text-sm text-emerald-700 font-medium mt-8">You&apos;re subscribed! Watch your inbox.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md mx-auto mt-8">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0 bg-white border border-gray-200 text-sm px-5 py-3 rounded-full outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-black text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-black/85 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {status === "loading" ? "Sending…" : "Subscribe"}
            </button>
          </form>
        )}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>
    </section>
  );
}
