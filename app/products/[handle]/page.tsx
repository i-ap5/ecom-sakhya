"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import ProductImage from "../../components/ProductImage";
import StarRating from "../../components/StarRating";
import SizeGuideModal from "../../components/SizeGuideModal";
import { useCart } from "../../context/CartContext";
import { getProductByHandle, listProducts, formatPrice } from "@/lib/medusa/products";
import { getProductRating } from "@/lib/rating";

const TABS = ["Description", "Details & Care", "Shipping & Returns"];

export default function ProductDetailPage() {
  const params = useParams<{ handle: string }>();
  const { addToCart, currencyCode, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null | undefined>(undefined);
  const [related, setRelated] = useState<HttpTypes.StoreProduct[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductByHandle(params.handle)
      .then((p) => {
        setProduct(p);
        const initial: Record<string, string> = {};
        p?.options?.forEach((opt) => {
          if (opt.title && opt.values?.[0]) initial[opt.title] = opt.values[0].value;
        });
        setSelectedValues(initial);
        setSelectedImage(0);
        setActiveTab(TABS[0]);

        const categoryId = p?.categories?.[0]?.id;
        if (categoryId) {
          listProducts({ categoryId, limit: 5 })
            .then(({ products }) => setRelated(products.filter((r) => r.id !== p?.id).slice(0, 4)))
            .catch((error) => console.error("Failed to load related products", error));
        } else {
          setRelated([]);
        }
      })
      .catch((error) => console.error("Failed to load product", error));
  }, [params.handle]);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    return product.variants?.find((v) =>
      v.options?.every((o) => selectedValues[o.option?.title ?? ""] === o.value)
    );
  }, [product, selectedValues]);

  if (product === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading…</main>
        <Footer />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="text-lg font-semibold">Product not found</p>
          <Link href="/shop" className="text-sm underline text-gray-500 hover:text-black">
            Back to shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const price = selectedVariant?.calculated_price?.calculated_amount;
  const images = product.images?.length ? product.images : product.thumbnail ? [{ url: product.thumbnail }] : [];
  const { rating, reviewCount } = getProductRating(product.id);
  const metadata = (product.metadata ?? {}) as { fit?: string; care?: string };

  const handleAddToBag = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="relative w-full rounded-2xl overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
              {images[selectedImage] && (
                <ProductImage
                  src={images[selectedImage].url}
                  alt={product.title}
                  fill
                  className="object-cover object-top"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === i ? "border-black" : "border-transparent"
                    }`}
                  >
                    <ProductImage src={img.url} alt="" fill className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-1" style={{ fontFamily: "var(--font-nohemi)" }}>
              {product.title}
            </h1>
            {product.subtitle && <p className="text-base text-gray-600 mb-2">{product.subtitle}</p>}
            <div className="mb-3">
              <StarRating rating={rating} reviewCount={reviewCount} size="md" />
            </div>
            <p className="text-2xl font-semibold mb-6">
              {price != null ? formatPrice(price, currencyCode) : "Select options"}
            </p>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-5">
              {TABS.map((tab) => (
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
              {activeTab === "Shipping & Returns" && (
                <p>
                  Shipping options and rates are calculated at checkout based on your address.
                  Unworn items with tags attached can be returned within 14 days of delivery.
                </p>
              )}
            </div>

            {product.options && product.options.length > 0 && (
              <div className="space-y-5 mb-8 max-w-sm">
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
                          className={`px-3 h-9 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
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
              {added ? "Added ✓" : "Add to bag"}
            </button>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl md:text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-nohemi)" }}>
              You may also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} currencyCode={currencyCode} onQuickAdd={addToCart} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
