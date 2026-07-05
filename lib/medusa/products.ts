import { sdk } from "./client";
import { getDefaultRegion } from "./region";
import type { HttpTypes } from "@medusajs/types";

const PRODUCT_FIELDS =
  "*variants,*variants.calculated_price,*variants.options,*options,*options.values,*images,*categories,+material,+metadata";

export async function listProducts(params?: {
  limit?: number;
  offset?: number;
  categoryId?: string;
  q?: string;
}): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> {
  const region = await getDefaultRegion();
  const { products, count } = await sdk.store.product.list({
    region_id: region.id,
    fields: PRODUCT_FIELDS,
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
    category_id: params?.categoryId,
    q: params?.q,
  });
  return { products, count };
}

export async function getProductByHandle(
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  const region = await getDefaultRegion();
  const { products } = await sdk.store.product.list({
    handle,
    region_id: region.id,
    fields: PRODUCT_FIELDS,
    limit: 1,
  });
  return products[0] ?? null;
}

export async function listCategories(): Promise<HttpTypes.StoreProductCategory[]> {
  const { product_categories } = await sdk.store.category.list({
    limit: 100,
    fields: "id,name,handle,description",
  });
  return product_categories;
}

export function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCheapestVariant(
  product: HttpTypes.StoreProduct
): HttpTypes.StoreProductVariant | undefined {
  return product.variants?.find((v) => v.calculated_price != null) ?? product.variants?.[0];
}
