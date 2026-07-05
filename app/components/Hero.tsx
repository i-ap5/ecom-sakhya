"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { listCategories, listProducts } from "@/lib/medusa/products";

interface CategoryCard {
  id: string;
  name: string;
  subtitle: string;
  thumbnail: string | null;
}

export default function Hero() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [cards, setCards] = useState<CategoryCard[]>([]);

  useEffect(() => {
    listProducts({ limit: 1 })
      .then(({ count }) => setProductCount(count))
      .catch((error) => console.error("Failed to load product count", error));

    listCategories()
      .then(async (categories) => {
        const top = categories.slice(0, 2);
        const withThumbnails = await Promise.all(
          top.map(async (category) => {
            const { products } = await listProducts({ categoryId: category.id, limit: 1 });
            return {
              id: category.id,
              name: category.name,
              subtitle: category.description || "Shop the collection",
              thumbnail: products[0]?.thumbnail ?? null,
            };
          })
        );
        setCards(withThumbnails);
      })
      .catch((error) => console.error("Failed to load hero categories", error));
  }, []);

  const middleCard = cards[0];
  const rightCard = cards[1];

  return (
    <>
      {/* SVG Clip Path definitions for custom layouts */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="clip-hero-left-path" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.05 C 0,0.02 0.02,0 0.05,0 L 0.95,0 C 0.98,0 1,0.02 1,0.05 L 1,0.95 C 1,0.98 0.98,1 0.95,1 L 0.40,1 C 0.37,1 0.35,0.98 0.35,0.96 L 0.35,0.89 C 0.35,0.87 0.33,0.85 0.30,0.85 L 0.05,0.85 C 0.02,0.85 0,0.83 0,0.80 Z" />
          </clipPath>
          <clipPath id="clip-hero-middle-path" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.05 C 0,0.02 0.02,0 0.05,0 L 0.60,0 C 0.63,0 0.65,0.02 0.65,0.05 L 0.65,0.11 C 0.65,0.13 0.67,0.15 0.70,0.15 L 0.95,0.15 C 0.98,0.15 1,0.17 1,0.20 L 1,0.95 C 1,0.98 0.98,1 0.95,1 L 0.05,1 C 0.02,1 0,0.98 0,0.95 Z" />
          </clipPath>
          <clipPath id="clip-hero-right-path" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.20 C 0,0.17 0.02,0.15 0.05,0.15 L 0.30,0.15 C 0.33,0.15 0.35,0.13 0.35,0.11 L 0.35,0.05 C 0.35,0.02 0.37,0 0.40,0 L 0.95,0 C 0.98,0 1,0.02 1,0.05 L 1,0.95 C 1,0.98 0.98,1 0.95,1 L 0.05,1 C 0.02,1 0,0.98 0,0.95 Z" />
          </clipPath>
        </defs>
      </svg>
      <section className="px-6 md:px-12 pt-12 pb-16 text-center max-w-7xl mx-auto w-full">
        <h1 className="text-5xl md:text-6xl lg:text-6xl leading-tight mb-4 max-w-5xl mx-auto tracking-tight text-[#171717]" style={{ fontFamily: "var(--font-nohemi)" }}>
          <span className="font-normal">Outfits That </span>
          <span className="font-semibold">Bring Out Your Best,<br /></span>
          <span className="font-normal block md:inline"> Made For Her</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Defining a new era of the luxury shopping experience. Saghya presents hand-curated collections
          of modern silhouettes and timeless staples, meticulously crafted for her.
        </p>

        {/* Asymmetric 3-card grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-[5fr_3.5fr_2.5fr] gap-3 relative md:h-[460px]"
        >
          {/* Left card wrapper */}
          <div className="relative w-full h-[260px] md:h-full col-span-2 md:col-span-1">
            {/* Left dark card (tab cutout at bottom-left) */}
            <div
              className="relative w-full h-full bg-[#1c1815] overflow-hidden"
              style={{ clipPath: "url(#clip-hero-left-path)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
                alt="Luxury fashion editorial"
                fill
                className="object-cover opacity-50 mix-blend-luminosity"
              />
              {/* Watermark W logo */}
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                <span className="text-[200px] md:text-[260px] font-bold tracking-tighter" style={{ fontFamily: "var(--font-nohemi)", WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.08)", color: "transparent" }}>W</span>
              </div>

              {/* Top Text Content */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 max-w-[200px] md:max-w-[280px] text-white text-left z-10">
                <p className="text-base md:text-lg font-bold tracking-wide">
                  {productCount != null ? `${productCount}+ Products` : "New Arrivals"}
                </p>
                <p className="text-[10px] md:text-xs text-gray-400 mt-1 md:mt-2 leading-relaxed font-light">
                  Fashion website is an online destination dedicated to showcasing the latest trends in fashion
                </p>
              </div>
            </div>

            {/* Shop now positioned at the bottom-left gap area (outside clipped card) */}
            <div className="absolute bottom-3 left-4 md:bottom-6 md:left-8 z-20">
              <Link
                href="/shop"
                className="group flex items-center gap-1.5 md:gap-3 text-black hover:text-gray-700 transition-colors text-sm md:text-lg tracking-wide"
              >
                <span>
                  <span className="font-extrabold">shop </span>
                  <span className="font-light">now</span>
                </span>
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#1c1815] text-white flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-black flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    className="md:w-3 md:h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Middle card (step down top-right) */}
          <Link
            href={middleCard ? `/shop?category=${middleCard.id}` : "/shop"}
            className="relative bg-[#eae6df] overflow-hidden h-[210px] md:h-full col-span-1 block"
            style={{ clipPath: "url(#clip-hero-middle-path)" }}
          >
            {middleCard?.thumbnail && (
              <ProductImage
                src={middleCard.thumbnail}
                alt={middleCard.name}
                fill
                className="object-cover object-top"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Bottom-left White text overlay */}
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 text-left text-white z-10">
              <p className="text-lg md:text-2xl font-bold tracking-wide capitalize" style={{ fontFamily: "var(--font-nohemi)" }}>
                {middleCard?.name ?? "Shop"}
              </p>
              <p className="text-[10px] md:text-xs text-gray-300 mt-1 font-light">{middleCard?.subtitle}</p>
            </div>
          </Link>

          {/* Right card (step down top-left) */}
          <Link
            href={rightCard ? `/shop?category=${rightCard.id}` : "/shop"}
            className="relative bg-[#eae6df] overflow-hidden h-[210px] md:h-full col-span-1 block"
            style={{ clipPath: "url(#clip-hero-right-path)" }}
          >
            {rightCard?.thumbnail && (
              <ProductImage
                src={rightCard.thumbnail}
                alt={rightCard.name}
                fill
                className="object-cover object-top"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Bottom-left White text overlay */}
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 text-left text-white z-10">
              <p className="text-lg md:text-2xl font-bold tracking-wide capitalize" style={{ fontFamily: "var(--font-nohemi)" }}>
                {rightCard?.name ?? "Shop"}
              </p>
              <p className="text-[10px] md:text-xs text-gray-300 mt-1 font-light">{rightCard?.subtitle}</p>
            </div>
          </Link>

          {/* Text inside the top dip between Card 2 and Card 3 */}
          <div
            className="absolute top-[280px] md:top-4 z-20 flex items-center justify-center select-none pointer-events-none text-black text-sm md:text-xl left-[calc(50%-90px)] md:left-[calc(8.5/11*(100%-24px)+18px-90px)]"
            style={{ width: "180px", fontFamily: "var(--font-nohemi)" }}
          >
            <span className="font-bold">collection </span>
            <span className="font-light">&nbsp;&apos;26</span>
          </div>
        </div>
      </section>
    </>
  );
}
