"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { formatPrice } from "@/lib/medusa/products";
import ProductImage from "./ProductImage";

const FREE_SHIPPING_THRESHOLD = 2000;

export default function CartDrawer() {
  const {
    cart,
    cartItems,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    cartCount,
    currencyCode,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const promotions = (cart?.promotions ?? []).filter((p) => p.code);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setApplyingPromo(true);
    setPromoError(null);
    const success = await applyPromoCode(promoInput.trim());
    setApplyingPromo(false);
    if (success) {
      setPromoInput("");
    } else {
      setPromoError("Invalid or expired code");
    }
  };

  const subtotal = cart?.item_subtotal ?? 0;
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-300 ease-in-out ${
        isCartOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* Dark backdrop blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[460px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-wide uppercase" style={{ fontFamily: "var(--font-nohemi)" }}>
              Shopping Bag
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Meter */}
        {cartItems.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex justify-between items-center text-xs font-medium mb-1.5">
              {qualifiesForFreeShipping ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Your order qualifies for Free Shipping!
                </span>
              ) : (
                <span className="text-gray-600">
                  Spend <span className="font-bold text-black">{formatPrice(remainingForFreeShipping, currencyCode)}</span> more for Free Shipping
                </span>
              )}
              <span className="text-gray-400">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-gray-800">Your bag is empty</h4>
              <p className="text-xs text-gray-400 max-w-[240px] mt-1 leading-relaxed">
                Start adding products to your bag to experience our luxury collections.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-5 border border-black text-black text-xs font-semibold py-2.5 px-6 rounded-full hover:bg-black hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-5 border-b border-gray-100 group animate-fade-in"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  {item.thumbnail && (
                    <ProductImage
                      src={item.thumbnail}
                      alt={item.product_title ?? item.title}
                      fill
                      className="object-cover object-top"
                      sizes="80px"
                    />
                  )}
                </div>

                {/* Product details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-gray-800 tracking-wide line-clamp-1">
                        {item.product_title ?? item.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors text-lg"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {/* Variant info */}
                    {item.variant_title && (
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[11px] text-gray-400">
                        <span>Variant: <strong className="text-gray-700">{item.variant_title}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-150 rounded-full h-8 px-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black rounded-full hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black rounded-full hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">
                        {formatPrice(item.total ?? item.unit_price * item.quantity, currencyCode)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-400">
                          {formatPrice(item.unit_price, currencyCode)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white space-y-4">
            {/* Promo code */}
            <div>
              {promotions.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="flex justify-between items-center bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-lg"
                    >
                      <span>{promo.code}</span>
                      <button
                        onClick={() => removePromoCode(promo.code!)}
                        className="text-emerald-600 hover:text-emerald-900 transition-colors"
                        aria-label={`Remove promo code ${promo.code}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 min-w-0 border border-gray-200 rounded-full px-4 py-2 text-xs outline-none focus:border-gray-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={applyingPromo || !promoInput.trim()}
                  className="text-xs font-semibold uppercase tracking-wider border border-black rounded-full px-4 py-2 hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-[11px] text-red-500 mt-1.5">{promoError}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">{formatPrice(subtotal, currencyCode)}</span>
              </div>
              {cart && cart.discount_total > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span>
                  <span className="font-semibold">-{formatPrice(cart.discount_total, currencyCode)}</span>
                </div>
              )}
              <p className="text-[11px] text-gray-400">Shipping and taxes calculated at checkout.</p>
            </div>

            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full bg-black text-white text-sm font-semibold py-4 rounded-full hover:bg-gray-800 transition-all active:scale-[0.99] shadow-sm text-center tracking-wider uppercase mt-2 block"
              style={{ fontFamily: "var(--font-nohemi)" }}
            >
              Proceed to checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
