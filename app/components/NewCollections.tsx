"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import { listProducts } from "@/lib/medusa/products";

export default function NewCollections() {
  const { addToCart, currencyCode } = useCart();
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProducts({ limit: 2 })
      .then(({ products }) => setProducts(products))
      .catch((error) => console.error("Failed to load collections", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-5xl font-semibold mb-3" style={{ fontFamily: "var(--font-nohemi)" }}>
          New Collections Of Us
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
          Empower your style with our exquisite collection of fashion-forward designs, crafted to
          inspire the confidence, beauty, and grace that define the modern wardrobe.
        </p>
      </div>

      {/* Dynamic Products Grid */}
      <div className="grid grid-cols-3 gap-4 items-end">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} currencyCode={currencyCode} onQuickAdd={addToCart} />
        ))}

        {/* Banner card linking to the full shop */}
        <Link
          href="/shop"
          className="group relative w-full rounded-3xl overflow-hidden border border-gray-100 bg-[#eae6df] flex items-center justify-center"
          style={{ aspectRatio: "3/4.5" }}
        >
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute top-4 right-4 w-[52px] h-[52px] rounded-full border border-[#9a8a7a] bg-[#f5f0e8] flex flex-col items-center justify-center">
            <span className="text-[6px] font-semibold uppercase text-[#5a4a3a] leading-tight tracking-wide text-center">BEST<br />COLLECTION</span>
          </div>
          <div className="relative text-center text-white">
            <p className="text-base font-bold uppercase tracking-widest drop-shadow">SAGHYA</p>
            <p className="text-[10px] uppercase tracking-wider opacity-90 mt-0.5">SHOP THE FULL COLLECTION</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
