"use client";
import { useEffect, useMemo, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { useCart } from "../context/CartContext";
import { listProducts, formatPrice } from "@/lib/medusa/products";
import { getProductRating } from "@/lib/rating";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";
import SizeGuideModal from "./SizeGuideModal";

const tabs = ["Description", "Details & Care", "Shipping"];

export default function FeaturedProduct() {
  const { addToCart, currencyCode, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null);
  const [activeTab, setActiveTab] = useState("Description");
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
  const metadata = (product.metadata ?? {}) as { fit?: string; care?: string };

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addToCart(selectedVariant.id);
  };

  return (
    <section className="w-full border-t border-b border-gray-100 bg-white">
      {/* Featured Segment Header */}
      <div className="flex border-b border-gray-100 bg-gray-50 px-6 md:px-12 py-3 items-center text-xs font-semibold uppercase tracking-wider text-gray-500">
        <span>Featured Masterpiece</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        {/* Left Image */}
        <div className="relative min-h-[400px] md:min-h-[520px]">
          {product.thumbnail && (
            <ProductImage
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover object-top transition-all duration-500"
            />
          )}
          {/* Brand Badge */}
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider">SAGHYA</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">FROM LOCAL DESIGNERS</p>
          </div>
          {/* BEST COLLECTION circular stamp */}
          <div className="absolute top-8 right-8 w-[60px] h-[60px] rounded-full border border-[#9a8a7a] bg-[#f5f0e8] flex flex-col items-center justify-center">
            <span className="text-[7px] font-semibold uppercase text-[#5a4a3a] leading-tight tracking-wide text-center">BEST<br />COLLECTION</span>
          </div>
        </div>

        {/* Right Product Details */}
        <div className="px-8 md:px-14 py-14 flex flex-col justify-center bg-white">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Best Collection</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-1" style={{ fontFamily: "var(--font-nohemi)" }}>
            {product.title}
          </h2>
          {product.subtitle && <p className="text-base text-gray-600 mb-1">{product.subtitle}</p>}
          <div className="mb-3">
            <StarRating rating={rating} reviewCount={reviewCount} size="md" />
          </div>
          <p className="text-2xl font-semibold mb-6">
            {price != null ? formatPrice(price, currencyCode) : "Select options"}
          </p>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm pb-3 transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-black text-black font-medium"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-500 leading-relaxed mb-6 min-h-[60px] space-y-2">
            {activeTab === "Description" && <p>{product.description ?? "No description available."}</p>}
            {activeTab === "Details & Care" && (
              <>
                <p>
                  <span className="font-semibold text-gray-700">Material:</span>{" "}
                  {product.material ?? "See product description"}
                </p>
                {metadata.fit && (
                  <p>
                    <span className="font-semibold text-gray-700">Fit:</span> {metadata.fit}
                  </p>
                )}
                {metadata.care && (
                  <p>
                    <span className="font-semibold text-gray-700">Care:</span> {metadata.care}
                  </p>
                )}
              </>
            )}
            {activeTab === "Shipping" && <p>Shipping options and rates are calculated at checkout based on your address.</p>}
          </div>

          {/* Interactive selectors, driven by the product's real options */}
          {product.options && product.options.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8 mt-2 max-w-md">
              {product.options.map((opt) => (
                <div key={opt.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {opt.title}: {selectedValues[opt.title]}
                    </p>
                    {opt.title.toLowerCase() === "size" && <SizeGuideModal />}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {opt.values?.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedValues((prev) => ({ ...prev, [opt.title]: v.value }))}
                        className={`px-3 h-8 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          selectedValues[opt.title] === v.value
                            ? "bg-black border-black text-white scale-105"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {v.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToBag}
            disabled={!selectedVariant || cartLoading}
            className="border border-black bg-black text-white text-sm font-semibold py-3.5 px-8 rounded-full hover:bg-white hover:text-black transition-colors w-full max-w-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to bag
          </button>
        </div>
      </div>
    </section>
  );
}
