"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import ProductImage from "./ProductImage";
import SectionHeader from "./SectionHeader";
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
    <section className="px-6 md:px-16 lg:px-28 max-w-[1440px] mx-auto w-full">
      <SectionHeader title="Shop by category" linkHref="/shop" />

      <div className="flex gap-3 overflow-x-auto snap-x no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-6 md:gap-4 md:overflow-visible">
        {tiles.map(({ category, thumbnail }) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.id}`}
            className="group snap-start shrink-0 w-[42%] sm:w-[30%] md:w-auto"
          >
            <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-[#f3f1ed]">
              {thumbnail && (
                <ProductImage
                  src={thumbnail}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 42vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 text-white text-sm md:text-base font-medium capitalize truncate">
                {category.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
