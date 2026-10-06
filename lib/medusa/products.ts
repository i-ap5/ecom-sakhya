import { sdk } from "./client";
import { getDefaultRegion } from "./region";
import type { HttpTypes } from "@medusajs/types";

const PRODUCT_FIELDS =
  "*variants,*variants.calculated_price,*variants.options,*options,*options.values,*images,*categories,*collection,+material,+metadata," +
  "+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder";

export async function listProducts(params?: {
  limit?: number;
  offset?: number;
  categoryId?: string;
  collectionId?: string;
  q?: string;
  order?: string;
}): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> {
  const region = await getDefaultRegion();
  const { products, count } = await sdk.store.product.list({
    region_id: region.id,
    fields: PRODUCT_FIELDS,
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
    category_id: params?.categoryId,
    collection_id: params?.collectionId,
    q: params?.q,
    order: params?.order,
  });
  return { products, count };
}

export async function listCollections(): Promise<HttpTypes.StoreCollection[]> {
  const { collections } = await sdk.store.collection.list({
    limit: 100,
    fields: "id,title,handle,metadata",
  });
  return collections;
}

// Finds a collection whose handle or title contains `keyword` (case-insensitive),
// so admins can rename "Onam Collections" → "Onam Edit '26" without code changes.
export async function findCollection(keyword: string): Promise<HttpTypes.StoreCollection | undefined> {
  const needle = keyword.toLowerCase();
  const collections = await listCollections();
  return collections.find(
    (c) => c.handle?.toLowerCase().includes(needle) || c.title.toLowerCase().includes(needle)
  );
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

// Prefers a variant that can actually be bought, so "Quick add" never picks a sold-out size.
export function getCheapestVariant(
  product: HttpTypes.StoreProduct
): HttpTypes.StoreProductVariant | undefined {
  const priced = product.variants?.filter((v) => v.calculated_price != null) ?? [];
  return priced.find(isVariantInStock) ?? priced[0] ?? product.variants?.[0];
}

export const LOW_STOCK_THRESHOLD = 5;

type StockFields = {
  inventory_quantity?: number | null;
  manage_inventory?: boolean | null;
  allow_backorder?: boolean | null;
};

// Units available to buy, or null when the variant isn't stock-limited
// (inventory not managed, or backorders allowed).
export function getVariantStock(variant: StockFields | null | undefined): number | null {
  if (!variant || !variant.manage_inventory || variant.allow_backorder) return null;
  return Math.max(variant.inventory_quantity ?? 0, 0);
}

export function isVariantInStock(variant: StockFields | null | undefined): boolean {
  const stock = getVariantStock(variant);
  return stock === null || stock > 0;
}

export function isProductSoldOut(product: HttpTypes.StoreProduct): boolean {
  const variants = product.variants ?? [];
  return variants.length > 0 && !variants.some(isVariantInStock);
}

// Total units left across variants when every variant is stock-limited and the
// total is low; undefined otherwise (plenty left, or unlimited).
export function getLowStockCount(product: HttpTypes.StoreProduct): number | undefined {
  const stocks = (product.variants ?? []).map(getVariantStock);
  if (stocks.length === 0 || stocks.some((s) => s === null)) return undefined;
  const total = (stocks as number[]).reduce((sum, s) => sum + s, 0);
  return total > 0 && total <= LOW_STOCK_THRESHOLD ? total : undefined;
}

export function isOnSale(product: HttpTypes.StoreProduct): boolean {
  return (product.variants ?? []).some((v) => getDiscountPercent(v) !== undefined);
}

const NEW_PRODUCT_WINDOW_DAYS = 30;

export function isNewProduct(product: HttpTypes.StoreProduct): boolean {
  if (!product.created_at) return false;
  const ageMs = Date.now() - new Date(product.created_at).getTime();
  return ageMs < NEW_PRODUCT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

// The store API's `calculated_price` object has more fields at runtime than the
// SDK's TS types declare (e.g. `original_amount`), since it reflects whether a
// price-list/promotion discount is active.
export function getOriginalAmount(
  variant: HttpTypes.StoreProductVariant | undefined
): number | undefined {
  const price = variant?.calculated_price as
    | { calculated_amount: number; original_amount?: number }
    | null
    | undefined;
  return price?.original_amount;
}

export function getDiscountPercent(
  variant: HttpTypes.StoreProductVariant | undefined
): number | undefined {
  const calculated = variant?.calculated_price?.calculated_amount;
  const original = getOriginalAmount(variant);
  if (calculated == null || original == null || original <= calculated) return undefined;
  return Math.round(((original - calculated) / original) * 100);
}
