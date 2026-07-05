import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";
import { formatPrice, getCheapestVariant } from "@/lib/medusa/products";
import { getProductRating } from "@/lib/rating";

export default function ProductCard({
  product,
  currencyCode,
  onQuickAdd,
}: {
  product: HttpTypes.StoreProduct;
  currencyCode: string;
  onQuickAdd: (variantId: string) => void;
}) {
  const variant = getCheapestVariant(product);
  const price = variant?.calculated_price?.calculated_amount;
  const { rating, reviewCount } = getProductRating(product.id);

  return (
    <div className="group flex flex-col">
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-gray-200 transition-colors"
        style={{ aspectRatio: "3/4" }}
      >
        <Link href={`/products/${product.handle}`}>
          {product.thumbnail && (
            <ProductImage
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
            />
          )}
        </Link>
        {variant && (
          <button
            onClick={() => onQuickAdd(variant.id)}
            className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm text-black text-xs font-bold py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-350 transform translate-y-2 group-hover:translate-y-0 text-center hover:bg-black hover:text-white cursor-pointer"
          >
            Quick Add
          </button>
        )}
      </div>
      <div className="mt-4 flex justify-between items-start gap-2">
        <Link href={`/products/${product.handle}`} className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#171717] truncate hover:text-gray-500 transition-colors">
            {product.title}
          </p>
          <div className="mt-1">
            <StarRating rating={rating} reviewCount={reviewCount} />
          </div>
        </Link>
        <p className="text-xs font-semibold text-gray-400 whitespace-nowrap">
          {price != null ? formatPrice(price, currencyCode) : "—"}
        </p>
      </div>
    </div>
  );
}
