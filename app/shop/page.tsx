"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import {
  listProducts,
  listCategories,
  listCollections,
  getCheapestVariant,
  isOnSale,
  isProductSoldOut,
} from "@/lib/medusa/products";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;
type Sort = (typeof SORTS)[number]["value"];

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 px-4 h-9 rounded-full text-sm transition-colors cursor-pointer ${
        active ? "bg-black text-white" : "border border-gray-200 text-gray-700 hover:border-black"
      }`}
    >
      {children}
    </button>
  );
}

function priceOf(product: HttpTypes.StoreProduct): number {
  return getCheapestVariant(product)?.calculated_price?.calculated_amount ?? Number.POSITIVE_INFINITY;
}

function ShopPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToCart, currencyCode } = useCart();

  // Filters live in the URL so navbar links, back/forward and shared links all work.
  const activeCategory = searchParams.get("category");
  const activeCollection = searchParams.get("collection");
  const searchQuery = searchParams.get("q") ?? "";
  const sort = (SORTS.some((s) => s.value === searchParams.get("sort")) ? searchParams.get("sort") : "featured") as Sort;
  const inStockOnly = searchParams.get("instock") === "1";
  const saleOnly = searchParams.get("sale") === "1";

  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [categories, setCategories] = useState<HttpTypes.StoreProductCategory[]>([]);
  const [collections, setCollections] = useState<HttpTypes.StoreCollection[]>([]);
  const requestKey = `${activeCategory}:${activeCollection}:${searchQuery}:${sort === "newest"}`;
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const loading = loadedFor !== requestKey;

  const setParam = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((error) => console.error("Failed to load categories", error));
    listCollections()
      .then(setCollections)
      .catch((error) => console.error("Failed to load collections", error));
  }, []);

  useEffect(() => {
    listProducts({
      limit: 100,
      categoryId: activeCategory ?? undefined,
      collectionId: activeCollection ?? undefined,
      q: searchQuery || undefined,
      order: sort === "newest" ? "-created_at" : undefined,
    })
      .then(({ products }) => {
        setProducts(products);
        setLoadedFor(requestKey);
      })
      .catch((error) => console.error("Failed to load products", error));
  }, [activeCategory, activeCollection, searchQuery, sort, requestKey]);

  const visible = useMemo(() => {
    let list = products;
    if (inStockOnly) list = list.filter((p) => !isProductSoldOut(p));
    if (saleOnly) list = list.filter(isOnSale);
    if (sort === "price-asc") list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
    return list;
  }, [products, inStockOnly, saleOnly, sort]);

  const hasSaleItems = products.some(isOnSale);
  const collectionName = collections.find((c) => c.id === activeCollection)?.title;
  const categoryName = categories.find((c) => c.id === activeCategory)?.name;
  const title = searchQuery ? `“${searchQuery}”` : collectionName ?? categoryName ?? "Shop all";
  const hasFilters = !!(activeCategory || activeCollection || searchQuery || inStockOnly || saleOnly);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-16 lg:px-28 pt-10 md:pt-14 pb-16 md:pb-24 max-w-[1440px] mx-auto w-full">
        {/* Heading */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="min-w-0">
            {searchQuery && <p className="text-sm text-gray-500 mb-1">Search results for</p>}
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight capitalize truncate">{title}</h1>
          </div>
          {!loading && (
            <p className="text-sm text-gray-500 shrink-0">
              {visible.length} {visible.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {/* Collections */}
        {collections.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 mb-3">
            {collections.map((c) => (
              <Chip
                key={c.id}
                active={activeCollection === c.id}
                onClick={() => setParam({ collection: activeCollection === c.id ? null : c.id })}
              >
                {c.title.trim()}
              </Chip>
            ))}
          </div>
        )}

        {/* Toolbar: categories + sort/filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 pb-6 mb-8 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 lg:flex-1">
            <Chip active={!activeCategory} onClick={() => setParam({ category: null })}>
              All
            </Chip>
            {categories.map((cat) => (
              <Chip key={cat.id} active={activeCategory === cat.id} onClick={() => setParam({ category: cat.id })}>
                {cat.name}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {hasSaleItems && (
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setParam({ sale: e.target.checked ? "1" : null })}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                On sale
              </label>
            )}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setParam({ instock: e.target.checked ? "1" : null })}
                className="w-4 h-4 accent-black cursor-pointer"
              />
              In stock
            </label>
            <div className="relative ml-auto lg:ml-0">
              <select
                value={sort}
                onChange={(e) => setParam({ sort: e.target.value === "featured" ? null : e.target.value })}
                aria-label="Sort products"
                className="appearance-none h-9 pl-4 pr-9 rounded-full border border-gray-200 text-sm bg-white cursor-pointer outline-none hover:border-black focus:border-black transition-colors"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-10 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] rounded-md bg-[#f3f1ed]" />
                <div className="h-4 w-3/4 bg-[#f3f1ed] rounded mt-3" />
                <div className="h-4 w-1/3 bg-[#f3f1ed] rounded mt-2" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-base font-medium">Nothing here yet</p>
            <p className="text-sm text-gray-500 mt-1">Try a different filter or search term.</p>
            {hasFilters && (
              <button
                onClick={() => router.replace(pathname, { scroll: false })}
                className="mt-6 text-sm font-medium underline underline-offset-4 decoration-gray-300 hover:decoration-black cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-10">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} currencyCode={currencyCode} onQuickAdd={addToCart} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
