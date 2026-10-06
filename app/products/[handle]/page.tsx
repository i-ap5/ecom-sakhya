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
import {
  getProductByHandle,
  listProducts,
  formatPrice,
  getDiscountPercent,
  getOriginalAmount,
  getVariantStock,
  isVariantInStock,
  LOW_STOCK_THRESHOLD,
} from "@/lib/medusa/products";
import { getProductRating, RATINGS_ENABLED } from "@/lib/rating";

type Selection = Record<string, string>;

function variantMatches(variant: HttpTypes.StoreProductVariant, selection: Selection): boolean {
  return (variant.options ?? []).every((o) => {
    const title = o.option?.title ?? "";
    return !(title in selection) || selection[title] === o.value;
  });
}

function selectionFor(variant: HttpTypes.StoreProductVariant | undefined): Selection {
  const selection: Selection = {};
  variant?.options?.forEach((o) => {
    if (o.option?.title) selection[o.option.title] = o.value;
  });
  return selection;
}

export default function ProductDetailPage() {
  const params = useParams<{ handle: string }>();
  const { addToCart, currencyCode, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null | undefined>(undefined);
  const [related, setRelated] = useState<HttpTypes.StoreProduct[]>([]);
  const [selectedValues, setSelectedValues] = useState<Selection>({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("Description");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductByHandle(params.handle)
      .then((p) => {
        setProduct(p);
        // Start on a size/colour that can actually be bought.
        const firstAvailable = p?.variants?.find(isVariantInStock) ?? p?.variants?.[0];
        setSelectedValues(selectionFor(firstAvailable));
        setSelectedImage(0);

        const categoryId = p?.categories?.[0]?.id;
        const collectionId = p?.collection_id ?? undefined;
        if (categoryId || collectionId) {
          listProducts(categoryId ? { categoryId, limit: 5 } : { collectionId, limit: 5 })
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
    const variants = product.variants ?? [];
    if (variants.length === 1) return variants[0];
    return variants.find((v) => (v.options?.length ?? 0) > 0 && variantMatches(v, selectedValues));
  }, [product, selectedValues]);

  if (product === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 px-6 md:px-16 lg:px-28 py-10 max-w-[1440px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 animate-pulse">
            <div className="aspect-[3/4] rounded-md bg-[#f3f1ed]" />
            <div className="space-y-4 pt-4">
              <div className="h-8 w-2/3 bg-[#f3f1ed] rounded" />
              <div className="h-6 w-1/4 bg-[#f3f1ed] rounded" />
              <div className="h-11 w-full bg-[#f3f1ed] rounded-full mt-10" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="text-lg font-medium">Product not found</p>
          <Link href="/shop" className="text-sm underline underline-offset-4 text-gray-500 hover:text-black">
            Back to shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const price = selectedVariant?.calculated_price?.calculated_amount;
  const discountPercent = getDiscountPercent(selectedVariant);
  const images = product.images?.length ? product.images : product.thumbnail ? [{ url: product.thumbnail }] : [];
  const { rating, reviewCount } = getProductRating(product.id);
  const metadata = (product.metadata ?? {}) as { fit?: string; care?: string };
  const stock = getVariantStock(selectedVariant);
  const inStock = selectedVariant ? isVariantInStock(selectedVariant) : false;
  const lowStock = inStock && stock !== null && stock <= LOW_STOCK_THRESHOLD;
  const collection = product.collection;

  // A value is available if some in-stock variant has it, given the other selected options.
  const isValueAvailable = (optionTitle: string, value: string) => {
    const rest = { ...selectedValues };
    delete rest[optionTitle];
    return (product.variants ?? []).some(
      (v) =>
        isVariantInStock(v) &&
        variantMatches(v, rest) &&
        (v.options ?? []).some((o) => o.option?.title === optionTitle && o.value === value)
    );
  };

  const handleAddToBag = async () => {
    if (!selectedVariant || !inStock) return;
    const ok = await addToCart(selectedVariant.id);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const sections = [
    { title: "Description", body: <p>{product.description ?? "No description available."}</p> },
    {
      title: "Details & Care",
      body: (
        <>
          <p>
            <span className="text-gray-800">Material:</span> {product.material ?? "See product description"}
          </p>
          {metadata.fit && (
            <p>
              <span className="text-gray-800">Fit:</span> {metadata.fit}
            </p>
          )}
          {metadata.care && (
            <p>
              <span className="text-gray-800">Care:</span> {metadata.care}
            </p>
          )}
        </>
      ),
    },
    {
      title: "Shipping & Returns",
      body: (
        <p>
          Shipping options and rates are calculated at checkout based on your address. Unworn items with tags
          attached can be returned within 14 days of delivery.
        </p>
      ),
    },
  ];

  const buttonLabel = cartLoading
    ? "Adding…"
    : !selectedVariant
      ? "Select an option"
      : !inStock
        ? "Sold out"
        : added
          ? "Added to bag ✓"
          : "Add to bag";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-16 lg:px-28 pt-6 pb-16 md:pb-24 max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 min-w-0">
          <Link href="/shop" className="hover:text-black transition-colors shrink-0">Shop</Link>
          {product.categories?.[0] && (
            <>
              <span aria-hidden>/</span>
              <Link
                href={`/shop?category=${product.categories[0].id}`}
                className="hover:text-black transition-colors shrink-0"
              >
                {product.categories[0].name}
              </Link>
            </>
          )}
          <span aria-hidden>/</span>
          <span className="text-gray-800 truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16">
          {/* Images */}
          <div className="flex flex-col-reverse md:flex-row gap-3 md:self-start">
            {images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`relative w-16 h-20 shrink-0 rounded-md overflow-hidden transition-opacity cursor-pointer ${
                      selectedImage === i ? "ring-1 ring-black ring-offset-2" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ProductImage src={img.url} alt="" fill sizes="64px" className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex-1 aspect-[3/4] rounded-md overflow-hidden bg-[#f3f1ed]">
              {images[selectedImage] && (
                <ProductImage
                  src={images[selectedImage].url}
                  alt={product.title}
                  fill
                  preload
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:sticky md:top-24 self-start">
            {collection && (
              <Link
                href={`/shop?collection=${collection.id}`}
                className="inline-block text-[11px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors mb-3"
              >
                {collection.title}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight">{product.title}</h1>
            {product.subtitle && <p className="text-base text-gray-600 mt-1">{product.subtitle}</p>}
            {RATINGS_ENABLED && (
              <div className="mt-2">
                <StarRating rating={rating} reviewCount={reviewCount} size="md" />
              </div>
            )}
            <div className="flex items-baseline gap-3 mt-4">
              <p className="text-xl font-medium">{price != null ? formatPrice(price, currencyCode) : "—"}</p>
              {discountPercent && (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    {formatPrice(getOriginalAmount(selectedVariant)!, currencyCode)}
                  </p>
                  <span className="text-xs font-medium text-[#b42318]">-{discountPercent}%</span>
                </>
              )}
            </div>

            {/* Options */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-6 mt-8">
                {product.options.map((opt) => (
                  <div key={opt.id}>
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-sm text-gray-600">
                        {opt.title}: <span className="text-black font-medium">{selectedValues[opt.title]}</span>
                      </p>
                      {opt.title.toLowerCase() === "size" && <SizeGuideModal />}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opt.values?.map((v) => {
                        const selected = selectedValues[opt.title] === v.value;
                        const available = isValueAvailable(opt.title, v.value);
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedValues((prev) => ({ ...prev, [opt.title]: v.value }))}
                            aria-pressed={selected}
                            aria-label={available ? v.value : `${v.value} (sold out)`}
                            className={`relative min-w-12 h-11 px-4 rounded-md text-sm border transition-colors cursor-pointer overflow-hidden ${
                              selected
                                ? available
                                  ? "border-black bg-black text-white"
                                  : "border-black text-gray-400"
                                : available
                                  ? "border-gray-200 text-gray-800 hover:border-black"
                                  : "border-gray-100 text-gray-300 hover:border-gray-300"
                            }`}
                          >
                            {v.value}
                            {!available && (
                              <span
                                aria-hidden
                                className="absolute inset-0 pointer-events-none text-gray-300 bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),currentColor_calc(50%-0.5px),currentColor_calc(50%+0.5px),transparent_calc(50%+0.5px))]"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock status */}
            {selectedVariant && (
              <p className="flex items-center gap-2 text-sm mt-6">
                <span
                  aria-hidden
                  className={`w-2 h-2 rounded-full ${!inStock ? "bg-gray-300" : lowStock ? "bg-[#f79009]" : "bg-[#12b76a]"}`}
                />
                {!inStock ? (
                  <span className="text-gray-500">Sold out in this option. Try another.</span>
                ) : lowStock ? (
                  <span className="text-[#b54708]">Only {stock} left. Order soon.</span>
                ) : (
                  <span className="text-gray-700">In stock</span>
                )}
              </p>
            )}

            <button
              onClick={handleAddToBag}
              disabled={!selectedVariant || !inStock || cartLoading}
              className="mt-4 w-full bg-black text-white text-sm font-medium py-4 rounded-full hover:bg-black/85 transition-colors cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {buttonLabel}
            </button>

            {/* Info accordion */}
            <div className="mt-10 border-t border-gray-100">
              {sections.map((section) => {
                const open = openSection === section.title;
                return (
                  <div key={section.title} className="border-b border-gray-100">
                    <button
                      onClick={() => setOpenSection(open ? null : section.title)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between py-4 text-sm font-medium cursor-pointer"
                    >
                      {section.title}
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={`transition-transform ${open ? "rotate-45" : ""}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                    {open && <div className="pb-5 text-sm text-gray-600 leading-relaxed space-y-2">{section.body}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20 md:mt-28">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-6 md:mb-8">You may also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-10">
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
