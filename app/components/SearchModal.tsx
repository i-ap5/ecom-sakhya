"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import ProductImage from "./ProductImage";
import { formatPrice, getCheapestVariant, listProducts } from "@/lib/medusa/products";
import { useCart } from "../context/CartContext";

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { currencyCode } = useCart();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([]);
  const [loadedForQuery, setLoadedForQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = query.trim();
  const loading = trimmedQuery !== "" && trimmedQuery !== loadedForQuery;
  const displayedResults = trimmedQuery ? results : [];

  // Reset the modal each time it's opened. Adjusting state during render
  // (rather than in an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setResults([]);
      setLoadedForQuery("");
    }
  }

  useEffect(() => {
    if (open) {
      const handle = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(handle);
    }
  }, [open]);

  useEffect(() => {
    if (!trimmedQuery) return;
    const handle = setTimeout(() => {
      listProducts({ q: trimmedQuery, limit: 6 })
        .then(({ products }) => {
          setResults(products);
          setLoadedForQuery(trimmedQuery);
        })
        .catch((error) => console.error("Search failed", error));
    }, 300);
    return () => clearTimeout(handle);
  }, [trimmedQuery]);

  if (!open) return null;

  const goToAllResults = () => {
    if (!trimmedQuery) return;
    router.push(`/shop?q=${encodeURIComponent(trimmedQuery)}`);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToAllResults();
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white max-w-2xl mx-auto mt-24 rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-gray-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for dresses, tops, kurtas…"
            className="flex-1 text-sm outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && <p className="text-center text-xs text-gray-400 py-8">Searching…</p>}

          {!loading && trimmedQuery && displayedResults.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-8">No products found for &quot;{query}&quot;</p>
          )}

          {displayedResults.map((product) => {
            const variant = getCheapestVariant(product);
            const price = variant?.calculated_price?.calculated_amount;
            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                onClick={onClose}
                className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  {product.thumbnail && (
                    <ProductImage src={product.thumbnail} alt={product.title} fill className="object-cover object-top" />
                  )}
                </div>
                <p className="flex-1 text-sm font-medium text-gray-800 truncate">{product.title}</p>
                <p className="text-sm font-semibold text-gray-500">
                  {price != null ? formatPrice(price, currencyCode) : "—"}
                </p>
              </Link>
            );
          })}

          {displayedResults.length > 0 && (
            <button
              onClick={goToAllResults}
              className="w-full text-center text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-black py-4 border-t border-gray-100 transition-colors cursor-pointer"
            >
              View all results for &quot;{query}&quot;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
