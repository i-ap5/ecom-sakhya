import { sdk } from "./client";
import type { HttpTypes } from "@medusajs/types";

export async function registerCustomer(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<HttpTypes.StoreCustomer> {
  const token = await sdk.auth.register("customer", "emailpass", { email, password });

  const { customer } = await sdk.store.customer.create(
    { email, first_name: firstName, last_name: lastName },
    {},
    { Authorization: `Bearer ${token}` }
  );

  // Registration token isn't tied to the new customer record yet — log in properly
  // so the SDK stores a fully authenticated session token.
  await sdk.auth.login("customer", "emailpass", { email, password });

  return customer;
}

export async function loginCustomer(email: string, password: string): Promise<void> {
  const result = await sdk.auth.login("customer", "emailpass", { email, password });
  if (typeof result !== "string") {
    throw new Error("Unexpected authentication response");
  }
}

export async function logoutCustomer(): Promise<void> {
  await sdk.auth.logout();
}

export async function getCurrentCustomer(): Promise<HttpTypes.StoreCustomer | null> {
  try {
    const { customer } = await sdk.store.customer.retrieve();
    return customer;
  } catch {
    return null;
  }
}

export async function updateCurrentCustomer(
  body: HttpTypes.StoreUpdateCustomer
): Promise<HttpTypes.StoreCustomer> {
  const { customer } = await sdk.store.customer.update(body);
  return customer;
}

export async function createCustomerAddress(
  body: HttpTypes.StoreCreateCustomerAddress
): Promise<HttpTypes.StoreCustomer> {
  const { customer } = await sdk.store.customer.createAddress(body);
  return customer;
}

export async function deleteCustomerAddress(addressId: string): Promise<void> {
  await sdk.store.customer.deleteAddress(addressId);
}

export async function listCustomerOrders(): Promise<HttpTypes.StoreOrder[]> {
  const { orders } = await sdk.store.order.list({ fields: "*items,*items.thumbnail" });
  return orders;
}

export async function retrieveOrder(orderId: string): Promise<HttpTypes.StoreOrder> {
  const { order } = await sdk.store.order.retrieve(orderId, {
    fields: "*items,*items.thumbnail,*shipping_address,*payment_collections.payment_sessions",
  });
  return order;
}
