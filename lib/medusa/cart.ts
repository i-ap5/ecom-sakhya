import { sdk } from "./client";
import { getDefaultRegion } from "./region";
import type { HttpTypes } from "@medusajs/types";

const CART_ID_KEY = "saghya_cart_id";

const CART_FIELDS =
  "*items,*items.variant,*items.variant.options,*items.product,*shipping_methods,*shipping_address,*payment_collection,*payment_collection.payment_sessions,*promotions";

export function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_ID_KEY);
}

function storeCartId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_ID_KEY, id);
}

export function clearStoredCartId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_ID_KEY);
}

export async function getOrCreateCart(): Promise<HttpTypes.StoreCart> {
  const region = await getDefaultRegion();
  const existingId = getStoredCartId();
  if (existingId) {
    try {
      const { cart } = await sdk.store.cart.retrieve(existingId, { fields: CART_FIELDS });
      // Carts freeze their currency at creation time. If the store's region
      // currency was changed after this cart was created, discard the stale
      // cart instead of showing the wrong currency.
      if (cart.currency_code === region.currency_code) {
        return cart;
      }
    } catch {
      // fall through to create a fresh cart below
    }
    clearStoredCartId();
  }

  const { cart } = await sdk.store.cart.create(
    { region_id: region.id },
    { fields: CART_FIELDS }
  );
  storeCartId(cart.id);
  return cart;
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.createLineItem(
    cartId,
    { variant_id: variantId, quantity },
    { fields: CART_FIELDS }
  );
  return cart;
}

export async function updateLineItemQuantity(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.updateLineItem(
    cartId,
    lineItemId,
    { quantity },
    { fields: CART_FIELDS }
  );
  return cart;
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<void> {
  await sdk.store.cart.deleteLineItem(cartId, lineItemId);
}

export async function retrieveCart(cartId: string): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.retrieve(cartId, { fields: CART_FIELDS });
  return cart;
}

export async function addPromotionCode(
  cartId: string,
  code: string
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.addPromotions(
    cartId,
    { promo_codes: [code] },
    { fields: CART_FIELDS }
  );
  return cart;
}

export async function removePromotionCode(
  cartId: string,
  code: string
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.removePromotions(
    cartId,
    { promo_codes: [code] },
    { fields: CART_FIELDS }
  );
  return cart;
}
