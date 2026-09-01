/**
 * Razorpay Checkout — the browser half of the payment flow.
 *
 * The backend has already created a Razorpay *order* when the payment session
 * was initiated; all this does is open Razorpay's modal against that order id
 * and tell the caller how it ended.
 *
 * Nothing here is trusted by the backend. Razorpay hands back a signature, but
 * the backend confirms the payment against Razorpay's API during cart
 * completion and via webhooks, so a tampered response cannot buy anything. The
 * modal closing successfully is a cue to complete the cart, not proof of
 * payment.
 */

const CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export type RazorpayCheckoutResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  order_id: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayCheckoutResponse) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (payload: unknown) => void) => void;
};

type RazorpayConstructor = new (
  options: RazorpayCheckoutOptions
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

/** The customer closed the modal without paying. Not an error worth logging. */
export class RazorpayCheckoutCancelled extends Error {
  constructor() {
    super("Payment cancelled");
    this.name = "RazorpayCheckoutCancelled";
  }
}

/** Razorpay reported the payment itself as failed (declined card, expired UPI). */
export class RazorpayPaymentFailed extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RazorpayPaymentFailed";
  }
}

let scriptPromise: Promise<RazorpayConstructor> | null = null;

function loadCheckoutScript(): Promise<RazorpayConstructor> {
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  if (!scriptPromise) {
    scriptPromise = new Promise<RazorpayConstructor>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CHECKOUT_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error("Razorpay Checkout loaded but exposed no global"));
        }
      };
      script.onerror = () => {
        // Let a later attempt retry instead of caching the failure forever.
        scriptPromise = null;
        reject(new Error("Could not load Razorpay Checkout"));
      };
      document.body.appendChild(script);
    });
  }

  return scriptPromise;
}

export type OpenCheckoutArgs = {
  /** Public key id — `rzp_test_*` or `rzp_live_*`. Never the key secret. */
  keyId: string;
  /** Razorpay order id from the payment session's `data.id`. */
  orderId: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
};

/**
 * Opens the modal and settles when the customer is done with it.
 *
 * Resolves with Razorpay's response on success, rejects with
 * `RazorpayCheckoutCancelled` if the modal was dismissed, or
 * `RazorpayPaymentFailed` if Razorpay reported a failure.
 */
export async function openRazorpayCheckout(
  args: OpenCheckoutArgs
): Promise<RazorpayCheckoutResponse> {
  const Razorpay = await loadCheckoutScript();

  return new Promise<RazorpayCheckoutResponse>((resolve, reject) => {
    // Razorpay fires `ondismiss` when the modal closes — including right after
    // a successful payment — so the first outcome to arrive wins.
    let settled = false;

    const instance = new Razorpay({
      key: args.keyId,
      order_id: args.orderId,
      amount: args.amount,
      currency: args.currency,
      name: args.name,
      description: args.description,
      prefill: args.prefill,
      theme: { color: "#000000" },
      handler: (response) => {
        if (settled) return;
        settled = true;
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          if (settled) return;
          settled = true;
          reject(new RazorpayCheckoutCancelled());
        },
      },
    });

    instance.on("payment.failed", (payload) => {
      if (settled) return;
      settled = true;

      const description = (
        payload as { error?: { description?: string } } | undefined
      )?.error?.description;

      reject(new RazorpayPaymentFailed(description ?? "Payment failed"));
    });

    instance.open();
  });
}
