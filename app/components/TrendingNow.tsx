"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import ProductImage from "./ProductImage";
import { listProducts } from "@/lib/medusa/products";

export default function TrendingNow() {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);

  useEffect(() => {
    listProducts({ limit: 5, offset: 2 })
      .then(({ products }) => setProducts(products))
      .catch((error) => console.error("Failed to load trending products", error));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-nohemi)" }}>
          Trending Now
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          The pieces our customers can&apos;t stop reaching for this season.
        </p>
      </div>

      {/* Horizontal portrait photo strip with slanted, staggered, overlapping layout */}
      <div className="relative flex justify-center items-center px-4 py-8 mt-4 select-none">
        {products.map((product, i) => {
          const isOdd = i % 2 === 0;
          const clipPathStyle = isOdd
            ? "polygon(0 0, 100% 8%, 100% 100%, 0 92%)"
            : "polygon(0 8%, 100% 0, 100% 92%, 0 100%)";
          const staggerClass = isOdd
            ? "translate-y-4 md:translate-y-6"
            : "-translate-y-4 md:-translate-y-6";

          return (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className={`relative flex-1 mx-[-8px] md:mx-[-14px] overflow-hidden group transition-all duration-300 hover:z-20 hover:scale-[1.03] ${staggerClass}`}
              style={{
                aspectRatio: "2/3",
                clipPath: clipPathStyle,
              }}
            >
              {product.thumbnail && (
                <ProductImage
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-0 right-0 text-center text-white text-[10px] font-semibold uppercase tracking-wide px-2 truncate">
                {product.title}
              </p>
            </Link>
          );
        })}

        {/* TRENDING floating badge */}
        <div className="absolute bottom-4 right-[15%] md:right-[20%] z-30 w-[60px] h-[60px] rounded-full border border-dashed border-[#9a8a7a]/60 bg-[#f5f0e8] flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[6.5px] font-bold uppercase text-[#5a4a3a] leading-tight tracking-[0.15em] text-center">
            TRENDING<br />NOW
          </span>
        </div>
      </div>
    </section>
  );
}
