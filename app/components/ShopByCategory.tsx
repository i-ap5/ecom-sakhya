"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import ProductImage from "./ProductImage";
import { listCategories, listProducts } from "@/lib/medusa/products";

interface CategoryTile {
  category: HttpTypes.StoreProductCategory;
  thumbnail: string | null;
}

export default function ShopByCategory() {
  const [tiles, setTiles] = useState<CategoryTile[]>([]);

  useEffect(() => {
    listCategories()
      .then(async (categories) => {
        const withThumbnails = await Promise.all(
          categories.map(async (category) => {
            const { products } = await listProducts({ categoryId: category.id, limit: 1 });
            return { category, thumbnail: products[0]?.thumbnail ?? null };
          })
        );
        setTiles(withThumbnails.filter((t) => t.thumbnail));
      })
      .catch((error) => console.error("Failed to load categories", error));
  }, []);

  if (tiles.length === 0) return null;

  return (
    <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold mb-3" style={{ fontFamily: "var(--font-nohemi)" }}>
          Shop By Category
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Find exactly what you&apos;re looking for, organized the way you shop.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiles.map(({ category, thumbnail }) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.id}`}
            className="group flex flex-col items-center"
          >
            <div
              className="relative w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-gray-200 transition-colors"
              style={{ aspectRatio: "1/1" }}
            >
              {thumbnail && (
                <ProductImage
                  src={thumbnail}
                  alt={category.name}
                  fill
                  className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#171717] group-hover:text-gray-500 transition-colors">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
