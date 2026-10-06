import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import ProductImage from "./ProductImage";
import {
  formatPrice,
  getCheapestVariant,
  getDiscountPercent,
  getLowStockCount,
  getOriginalAmount,
  isNewProduct,
  isProductSoldOut,
} from "@/lib/medusa/products";

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
  const discountPercent = getDiscountPercent(variant);
  const isNew = isNewProduct(product);
  const soldOut = isProductSoldOut(product);
  const lowStock = soldOut ? undefined : getLowStockCount(product);
  const badge = soldOut
    ? { label: "Sold out", className: "bg-white/90 text-gray-600" }
    : discountPercent
      ? { label: `-${discountPercent}%`, className: "bg-[#b42318] text-white" }
      : isNew
        ? { label: "New", className: "bg-white text-black" }
        : undefined;

  return (
    <div className="group flex flex-col">
      <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-[#f3f1ed]">
        <Link href={`/products/${product.handle}`} aria-label={product.title}>
          {product.thumbnail && (
            <ProductImage
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={`object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] ${soldOut ? "opacity-60" : ""}`}
            />
          )}
        </Link>
        {badge && (
          <span
            className={`absolute top-3 left-3 z-10 text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-sm ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
        {variant && !soldOut && (
          <button
            onClick={() => onQuickAdd(variant.id)}
            className="absolute bottom-3 left-3 right-3 bg-white text-black text-xs font-medium py-2.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white cursor-pointer"
          >
            Quick add
          </button>
        )}
      </div>
      <Link href={`/products/${product.handle}`} className="mt-3 flex flex-col gap-1">
        <p className="text-sm text-[#171717] truncate">{product.title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-medium">{price != null ? formatPrice(price, currencyCode) : "—"}</p>
          {discountPercent && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(getOriginalAmount(variant)!, currencyCode)}
            </p>
          )}
        </div>
        {lowStock && <p className="text-xs text-[#b54708]">Only {lowStock} left</p>}
      </Link>
    </div>
  );
}
