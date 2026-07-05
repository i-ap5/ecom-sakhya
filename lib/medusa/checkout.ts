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
