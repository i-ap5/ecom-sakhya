"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { useCart } from "../context/CartContext";
import { listProducts, formatPrice } from "@/lib/medusa/products";
import { getProductRating, RATINGS_ENABLED } from "@/lib/rating";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";
import SizeGuideModal from "./SizeGuideModal";

export default function FeaturedProduct() {
  const { addToCart, currencyCode, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  useEffect(() => {
    listProducts({ limit: 1 })
      .then(({ products }) => {
        const p = products[0];
        if (!p) return;
        setProduct(p);
        const initial: Record<string, string> = {};
        p.options?.forEach((opt) => {
          if (opt.title && opt.values?.[0]) initial[opt.title] = opt.values[0].value;
        });
        setSelectedValues(initial);
      })
      .catch((error) => console.error("Failed to load featured product", error));
  }, []);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    return product.variants?.find((v) =>
      v.options?.every((o) => selectedValues[o.option?.title ?? ""] === o.value)
    );
  }, [product, selectedValues]);

  if (!product) return null;

  const price = selectedVariant?.calculated_price?.calculated_amount;
  const { rating, reviewCount } = getProductRating(product.id);
  const gallery = [product.thumbnail, ...(product.images ?? []).map((img) => img.url)]
    .filter((url, i, all): url is string => !!url && all.indexOf(url) === i)
    .slice(0, 2);

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addToCart(selectedVariant.id);
  };

  return (
    <section className="px-6 md:px-16 lg:px-28 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 md:gap-14 items-center">
        {/* Images */}
        <div className={`grid gap-2 md:gap-3 ${gallery.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {gallery.map((url, i) => (
            <Link
              key={url}
              href={`/products/${product.handle}`}
              className="relative aspect-[3/4] rounded-md overflow-hidden bg-[#f3f1ed]"
            >
              <ProductImage
                src={url}
                alt={`${product.title} ${i + 1}`}
                fill
                sizes="(min-width: 768px) 30vw, 50vw"
                className="object-cover object-top"
              />
            </Link>
          ))}
        </div>

        {/* Buy box */}
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight">{product.title}</h2>
          <div className="flex items-center gap-4 mt-3 mb-8">
            <p className="text-xl font-medium">
              {price != null ? formatPrice(price, currencyCode) : "—"}
            </p>
            {RATINGS_ENABLED && <StarRating rating={rating} reviewCount={reviewCount} size="md" />}
          </div>

          {product.options?.map((opt) => (
            <div key={opt.id} className="mb-6">
              <div className="flex items-center justify-between mb-2 max-w-sm">
                <p className="text-xs text-gray-500">
                  {opt.title}: <span className="text-black font-medium">{selectedValues[opt.title]}</span>
                </p>
                {opt.title.toLowerCase() === "size" && <SizeGuideModal />}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {opt.values?.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedValues((prev) => ({ ...prev, [opt.title]: v.value }))}
                    className={`min-w-10 px-3 h-9 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      selectedValues[opt.title] === v.value
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-5 mt-2">
            <button
              onClick={handleAddToBag}
              disabled={!selectedVariant || cartLoading}
              className="bg-black text-white text-sm font-medium py-3.5 px-10 rounded-full hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to bag
            </button>
            <Link
              href={`/products/${product.handle}`}
              className="text-sm font-medium underline underline-offset-4 decoration-gray-300 hover:decoration-black"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
