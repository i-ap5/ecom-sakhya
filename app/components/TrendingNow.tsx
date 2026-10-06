"use client";
import { useEffect, useRef, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import { findCollection, listProducts } from "@/lib/medusa/products";

export default function TrendingNow() {
  const { addToCart, currencyCode } = useCart();
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [viewAllHref, setViewAllHref] = useState("/shop");
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Curated from a Medusa collection named "Trending"; until one exists, fall back to
    // products beyond the New Arrivals row.
    findCollection("trending")
      .then((collection) => {
        if (collection) setViewAllHref(`/shop?collection=${collection.id}`);
        return listProducts(collection ? { collectionId: collection.id, limit: 12 } : { limit: 8, offset: 4 });
      })
      .then(({ products }) => setProducts(products))
      .catch((error) => console.error("Failed to load trending products", error));
  }, []);

  if (products.length === 0) return null;

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="px-6 md:px-16 lg:px-28 max-w-[1440px] mx-auto w-full">
      <SectionHeader title="Trending now" linkHref={viewAllHref}>
        <div className="hidden md:flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:border-black hover:text-black transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={dir === -1 ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"} />
              </svg>
            </button>
          ))}
        </div>
      </SectionHeader>

      <div
        ref={trackRef}
        className="flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6 md:mx-0 md:px-0"
      >
        {products.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-[62%] sm:w-[40%] md:w-[calc((100%-3*1.25rem)/4)]">
            <ProductCard product={p} currencyCode={currencyCode} onQuickAdd={addToCart} />
          </div>
        ))}
      </div>
    </section>
  );
}
