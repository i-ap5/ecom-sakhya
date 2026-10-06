"use client";
import { useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { updateCurrentCustomer } from "@/lib/medusa/customer";

// Same `newsletter` metadata flag the homepage sign-up writes, so both stay in sync in the admin.
export default function NewsletterToggle({
  customer,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer;
  onChange: () => Promise<void>;
}) {
  const subscribed = customer.metadata?.newsletter === true;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const toggle = async () => {
    setSaving(true);
    setError(false);
    try {
      await updateCurrentCustomer({
        metadata: {
          ...(customer.metadata ?? {}),
          newsletter: !subscribed,
          ...(subscribed ? {} : { newsletter_subscribed_at: new Date().toISOString() }),
        },
      });
      await onChange();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-[#f3f1ed] px-5 py-4 mb-8">
      <div>
        <p className="text-sm font-medium">Email me about new drops</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {error ? "Couldn't save. Please try again." : "New collections and restocks, a few times a month."}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={subscribed}
        aria-label="Newsletter subscription"
        onClick={toggle}
        disabled={saving}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors cursor-pointer disabled:opacity-60 ${
          subscribed ? "bg-black" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            subscribed ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
