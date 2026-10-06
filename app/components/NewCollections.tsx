"use client";
import { useEffect, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import { listProducts } from "@/lib/medusa/products";

export default function NewCollections() {
  const { addToCart, currencyCode } = useCart();
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProducts({ limit: 4, order: "-created_at" })
      .then(({ products }) => setProducts(products))
      .catch((error) => console.error("Failed to load collections", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="px-6 md:px-16 lg:px-28 max-w-[1440px] mx-auto w-full">
      <SectionHeader title="New arrivals" linkHref="/shop?sort=newest" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-10">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} currencyCode={currencyCode} onQuickAdd={addToCart} />
        ))}
      </div>
    </section>
  );
}
