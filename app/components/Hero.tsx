"use client";
import { useEffect, useState } from "react";
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
  const [cards, setCards] = useState<CategoryCard[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    listCategories()
      .then(async (categories) => {
        const withCounts = await Promise.all(
          categories.map(async (category) => {
            const { count } = await listProducts({ categoryId: category.id, limit: 1 });
            return { ...category, count };
          })
        );
        const stocked = withCounts.filter((category) => category.count > 0).sort((a, b) => b.count - a.count);
        const kurtaCategory = stocked.find((category) => category.name.toLowerCase().includes("kurta"));
        const top = kurtaCategory ?? stocked[0];
        const runnerUp = stocked.find((category) => category.id !== top?.id);
        if (!top) {
          setCards([]);
          return;
        }

        // Only products that actually have an image can fill a card.
        const imagesFor = async (categoryId: string, limit: number) => {
          const { products } = await listProducts({ categoryId, limit });
          return products.map((p) => p.thumbnail).filter((t): t is string => !!t);
        };

        const topImages = await imagesFor(top.id, 8);
        setHeroImage(topImages[3] ?? topImages[0] ?? null);
        const slots: CategoryCard[] = [
          {
            id: top.id,
            name: top.name,
            subtitle: top.description || "Shop the collection",
            thumbnail: topImages[0] ?? null,
          },
        ];

        // Prefer a second category so the two cards show different labels.
        const runnerUpImage = runnerUp ? (await imagesFor(runnerUp.id, 4))[0] : undefined;
        if (runnerUp && runnerUpImage) {
          slots.push({
            id: runnerUp.id,
            name: runnerUp.name,
            subtitle: runnerUp.description || "Shop the collection",
            thumbnail: runnerUpImage,
          });
        } else if (topImages[1]) {
          slots.push({
            id: top.id,
            name: "New In",
            subtitle: "Shop the collection",
            thumbnail: topImages[1],
          });
        }

        setCards(slots);
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
      <section className="px-6 md:px-16 lg:px-28 pt-10 md:pt-14 pb-4 text-center max-w-[1440px] mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-medium leading-tight mb-8 md:mb-10 tracking-tight text-[#171717]">
          Bring Out Your Best
        </h1>

        {/* Asymmetric 3-card grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-[5fr_3.5fr_2.5fr] gap-3 relative md:h-[540px]"
        >
          {/* Left card wrapper */}
          <div className="relative w-full h-[300px] md:h-full col-span-2 md:col-span-1">
            {/* Left dark card (tab cutout at bottom-left) */}
            <div
              className="relative w-full h-full bg-[#1c1815] overflow-hidden"
              style={{ clipPath: "url(#clip-hero-left-path)" }}
            >
              {heroImage && (
                <ProductImage
                  src={heroImage}
                  alt="Luxury fashion editorial"
                  fill
                  className="object-cover object-top opacity-50 mix-blend-luminosity"
                />
              )}
              {/* Top Text Content */}
              <div className="absolute top-5 left-5 md:top-8 md:left-8 text-white text-left z-10">
                <p className="text-lg md:text-2xl font-medium">Onam Collection</p>
              </div>
            </div>

            {/* Shop now positioned at the bottom-left gap area (outside clipped card) */}
            <div className="absolute bottom-[10px] left-3 md:bottom-6 md:left-8 z-20">
              <Link
                href="/shop"
                className="group flex items-center gap-1.5 md:gap-3 text-black hover:text-gray-700 transition-colors text-xs md:text-base font-medium"
              >
                <span>Shop now</span>
                <div className="w-6 h-6 md:w-9 md:h-9 rounded-full bg-[#1c1815] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
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
            className="relative bg-[#eae6df] overflow-hidden h-[250px] md:h-full col-span-1 block"
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
              <p className="text-lg md:text-2xl font-medium capitalize">
                {middleCard?.name ?? "Shop"}
              </p>
            </div>
          </Link>

          {/* Right card (step down top-left) */}
          <Link
            href={rightCard ? `/shop?category=${rightCard.id}` : "/shop"}
            className="relative bg-[#eae6df] overflow-hidden h-[250px] md:h-full col-span-1 block"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Bottom-left White text overlay */}
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 text-left text-white z-10">
              <p className="text-lg md:text-2xl font-medium capitalize">
                {rightCard?.name ?? "Shop"}
              </p>
            </div>
          </Link>

          {/* Text inside the top dip between Card 2 and Card 3 */}
          <div
            className="absolute top-[312px] h-[37px] md:top-4 md:h-auto z-20 flex items-center justify-center select-none pointer-events-none text-black text-xs md:text-base font-medium left-[calc(50%-90px)] md:left-[calc(8.5/11*(100%-24px)+18px-90px)]"
            style={{ width: "180px" }}
          >
            Collection &apos;26
          </div>
        </div>
      </section>
    </>
  );
}
