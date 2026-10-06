"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { findCollection, listCategories, listProducts } from "@/lib/medusa/products";

export default function CampaignBanner() {
  const [images, setImages] = useState<string[]>([]);
  const [href, setHref] = useState("/shop");
  const [heading, setHeading] = useState("The Onam Edit");

  useEffect(() => {
    // Driven by the Medusa collection whose name contains "onam" — rename or swap it in the
    // admin and the banner follows. Set collection metadata `banner_heading` to override the text.
    findCollection("onam")
      .then(async (collection) => {
        let filter: { collectionId?: string; categoryId?: string } = {};
        if (collection) {
          filter = { collectionId: collection.id };
          setHref(`/shop?collection=${collection.id}`);
          const metaHeading = (collection.metadata as { banner_heading?: string } | null)?.banner_heading;
          setHeading(metaHeading || collection.title.trim());
        } else {
          const categories = await listCategories();
          const kurtaCategory = categories.find((category) => category.name.toLowerCase().includes("kurt"));
          if (kurtaCategory) {
            filter = { categoryId: kurtaCategory.id };
            setHref(`/shop?category=${kurtaCategory.id}`);
          }
        }
        const { products } = await listProducts({ ...filter, limit: 12 });
        // Prefer each product's secondary photos so the banner doesn't repeat the hero thumbnails.
        const urls = products
          .flatMap((p) => [...(p.images ?? []).map((img) => img.url), p.thumbnail])
          .filter((url, i, all): url is string => !!url && all.indexOf(url) === i);
        const secondary = urls.filter((url) => !products.some((p) => p.thumbnail === url));
        setImages([...secondary, ...urls].filter((url, i, all) => all.indexOf(url) === i).slice(0, 3));
      })
      .catch((error) => console.error("Failed to load campaign images", error));
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="px-6 md:px-16 lg:px-28 max-w-[1440px] mx-auto w-full">
      <Link href={href} className="group relative block overflow-hidden rounded-md bg-[#1c1815]">
        <div className={`grid gap-0.5 ${images.length >= 3 ? "grid-cols-2 md:grid-cols-3" : images.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
          {images.map((url, i) => (
            <div
              key={url}
              className={`relative aspect-[3/4] md:aspect-square ${i === 2 ? "hidden md:block" : ""}`}
            >
              <ProductImage
                src={url}
                alt={heading}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col items-center text-center text-white">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight capitalize">{heading}</h2>
          <span className="mt-5 bg-white text-black text-sm font-medium px-7 py-3 rounded-full transition-colors group-hover:bg-white/90">
            Shop the collection
          </span>
        </div>
      </Link>
    </section>
  );
}
