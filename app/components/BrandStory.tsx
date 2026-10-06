"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { listProducts } from "@/lib/medusa/products";

export default function BrandStory() {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    listProducts({ limit: 1, offset: 1 })
      .then(({ products }) => {
        const p = products[0];
        setImage(p?.images?.[1]?.url ?? p?.thumbnail ?? null);
      })
      .catch((error) => console.error("Failed to load brand story image", error));
  }, []);

  return (
    <section className="px-6 md:px-16 lg:px-28 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="relative aspect-[4/5] md:aspect-[5/4] rounded-md overflow-hidden bg-[#f3f1ed]">
          {image && (
            <ProductImage
              src={image}
              alt="Label We"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-top"
            />
          )}
        </div>
        <div className="md:max-w-md">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4">Our story</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">
            Made by local designers, chosen for her.
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-5">
            Every piece at Label We is hand-picked from independent makers — modern silhouettes and
            everyday staples you&apos;ll wear for years.
          </p>
          <Link
            href="/shop"
            className="inline-block mt-8 bg-black text-white text-sm font-medium px-7 py-3 rounded-full hover:bg-black/85 transition-colors"
          >
            Discover the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
