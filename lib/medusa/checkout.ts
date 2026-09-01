import { sdk } from "./client";
import type { HttpTypes } from "@medusajs/types";

const CART_FIELDS =
  "*items,*items.variant,*items.variant.options,*items.product,*shipping_methods,*shipping_address,*payment_collection,*payment_collection.payment_sessions";

export async function updateCartAddresses(
  cartId: string,
  body: HttpTypes.StoreUpdateCart
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.update(cartId, body, { fields: CART_FIELDS });
  return cart;
}

export async function listShippingOptions(
  cartId: string
): Promise<HttpTypes.StoreCartShippingOption[]> {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cartId,
  });
  return shipping_options;
}

export async function addShippingMethod(
  cartId: string,
  optionId: string
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.addShippingMethod(
    cartId,
    { option_id: optionId },
    { fields: CART_FIELDS }
  );
  return cart;
}

export async function listPaymentProviders(
  regionId: string
): Promise<HttpTypes.StorePaymentProvider[]> {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id: regionId,
  });
  return payment_providers;
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  providerId: string
): Promise<HttpTypes.StorePaymentCollection> {
  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: providerId,
  });
  return payment_collection;
}

export async function completeCart(
  cartId: string
): Promise<HttpTypes.StoreCompleteCartResponse> {
  return sdk.store.cart.complete(cartId);
}

/**
 * The backend registers the provider as `pp_razorpay_razorpay`
 * (`pp_{identifier}_{id}`). Matching on the prefix keeps this working if the
 * `id` in `medusa-config.ts` is ever changed.
 */
export function isRazorpayProvider(providerId: string): boolean {
  return providerId.startsWith("pp_razorpay");
}

/**
 * Prefer Razorpay when the region has it enabled, otherwise fall back to
 * whatever else is configured — a store still on the manual provider keeps
 * working instead of failing at checkout.
 */
export function selectPaymentProvider(
  providers: HttpTypes.StorePaymentProvider[]
): HttpTypes.StorePaymentProvider | undefined {
  return providers.find((p) => isRazorpayProvider(p.id)) ?? providers[0];
}

/**
 * The Razorpay order our backend created, read off the session it just
 * initiated. `data.id` is set by the provider's `initiatePayment`.
 */
export function getRazorpayOrderFromCollection(
  collection: HttpTypes.StorePaymentCollection
): { orderId: string; amount?: number; currency?: string } {
  const session = collection.payment_sessions?.find((s) =>
    isRazorpayProvider(s.provider_id)
  );

  const orderId = session?.data?.id;

  if (typeof orderId !== "string" || !orderId) {
    throw new Error(
      "Razorpay payment session has no order id — check RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET on the backend"
    );
  }

  const amount = session?.data?.amount;
  const currency = session?.data?.currency;

  return {
    orderId,
    amount: typeof amount === "number" ? amount : undefined,
    currency: typeof currency === "string" ? currency : undefined,
  };
}
