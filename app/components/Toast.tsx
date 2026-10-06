"use client";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

const AUTO_DISMISS_MS = 5000;

export default function Toast() {
  const { notice, dismissNotice } = useCart();

  useEffect(() => {
    if (!notice) return;
    const handle = setTimeout(dismissNotice, AUTO_DISMISS_MS);
    return () => clearTimeout(handle);
  }, [notice, dismissNotice]);

  if (!notice) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[300] bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md bg-[#171717] text-white text-sm rounded-md shadow-lg px-4 py-3 flex items-start gap-3 animate-[toast-in_200ms_ease-out]"
    >
      <p className="flex-1 leading-relaxed">{notice}</p>
      <button
        onClick={dismissNotice}
        aria-label="Dismiss"
        className="shrink-0 text-white/60 hover:text-white transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
