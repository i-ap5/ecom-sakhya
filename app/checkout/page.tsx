"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { clearStoredCartId } from "@/lib/medusa/cart";
import { getDefaultRegion } from "@/lib/medusa/region";
import { formatPrice } from "@/lib/medusa/products";
import {
  updateCartAddresses,
  listShippingOptions,
  addShippingMethod,
  listPaymentProviders,
  initiatePaymentSession,
  completeCart,
} from "@/lib/medusa/checkout";

type Step = "address" | "shipping" | "payment";

const emptyAddress = {
  first_name: "",
  last_name: "",
  address_1: "",
  city: "",
  postal_code: "",
  province: "",
  phone: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartItems, setCart, currencyCode, applyPromoCode, removePromoCode } = useCart();
  const [step, setStep] = useState<Step>("address");
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(emptyAddress);
  const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreCartShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const [syncedCartId, setSyncedCartId] = useState<string | null>(null);

  useEffect(() => {
    getDefaultRegion().then(setRegion).catch((error) => console.error(error));
  }, []);

  // Pre-fill the form from the cart's existing address (if any) the first time
  // it becomes available. This runs during render, not an effect, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (cart && cart.id !== syncedCartId) {
    setSyncedCartId(cart.id);
    if (cart.email) setEmail(cart.email);
    if (cart.shipping_address) {
      setAddress({
        first_name: cart.shipping_address.first_name ?? "",
        last_name: cart.shipping_address.last_name ?? "",
        address_1: cart.shipping_address.address_1 ?? "",
        city: cart.shipping_address.city ?? "",
        postal_code: cart.shipping_address.postal_code ?? "",
        province: cart.shipping_address.province ?? "",
        phone: cart.shipping_address.phone ?? "",
      });
    }
  }

  if (cart && cartItems.length === 0 && step === "address") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="text-lg font-semibold">Your bag is empty</p>
          <Link href="/shop" className="text-sm underline text-gray-500 hover:text-black">
            Continue shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || !region) return;
    setError(null);
    setPlacing(true);
    try {
      const countryCode = region.countries?.[0]?.iso_2 ?? "in";
      const updated = await updateCartAddresses(cart.id, {
        email,
        shipping_address: { ...address, country_code: countryCode },
        billing_address: { ...address, country_code: countryCode },
      });
      setCart(updated);
      const options = await listShippingOptions(cart.id);
      setShippingOptions(options);
      setStep("shipping");
    } catch (err) {
      console.error(err);
      setError("Failed to save address. Please check your details and try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!cart || !selectedShippingId) return;
    setError(null);
    setPlacing(true);
    try {
      const updated = await addShippingMethod(cart.id, selectedShippingId);
      setCart(updated);
      setStep("payment");
    } catch (err) {
      console.error(err);
      setError("Failed to select shipping method.");
    } finally {
      setPlacing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || !region) return;
    setError(null);
    setPlacing(true);
    try {
      const providers = await listPaymentProviders(region.id);
      const provider = providers[0];
      if (!provider) throw new Error("No payment provider configured");
      await initiatePaymentSession(cart, provider.id);

      const result = await completeCart(cart.id);
      if (result.type === "order") {
        clearStoredCartId();
        router.push(`/order/confirmed/${result.order.id}`);
      } else {
        setError(result.error?.message ?? "Something went wrong placing your order.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-semibold mb-8" style={{ fontFamily: "var(--font-nohemi)" }}>
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex gap-6 mb-8 text-xs font-semibold uppercase tracking-wider">
          <span className={step === "address" ? "text-black" : "text-gray-400"}>1. Address</span>
          <span className={step === "shipping" ? "text-black" : "text-gray-400"}>2. Shipping</span>
          <span className={step === "payment" ? "text-black" : "text-gray-400"}>3. Payment</span>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">{error}</p>
        )}

        {step === "address" && (
          <form onSubmit={handleAddressSubmit} className="space-y-4 max-w-md">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="First name"
                value={address.first_name}
                onChange={(e) => setAddress({ ...address, first_name: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <input
                required
                placeholder="Last name"
                value={address.last_name}
                onChange={(e) => setAddress({ ...address, last_name: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
            <input
              required
              placeholder="Address"
              value={address.address_1}
              onChange={(e) => setAddress({ ...address, address_1: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <input
                required
                placeholder="Postal code"
                value={address.postal_code}
                onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="State / Province"
                value={address.province}
                onChange={(e) => setAddress({ ...address, province: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <input
                required
                placeholder="Phone"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={placing}
              className="bg-black text-white text-sm font-semibold py-3.5 px-8 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {placing ? "Saving…" : "Continue to shipping"}
            </button>
          </form>
        )}

        {step === "shipping" && (
          <div className="space-y-4 max-w-md">
            {shippingOptions.length === 0 ? (
              <p className="text-sm text-gray-400">No shipping options available for this address.</p>
            ) : (
              shippingOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer ${
                    selectedShippingId === opt.id ? "border-black" : "border-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShippingId === opt.id}
                      onChange={() => setSelectedShippingId(opt.id)}
                    />
                    {opt.name}
                  </span>
                  <span className="text-sm font-semibold">
                    {formatPrice(opt.calculated_price?.calculated_amount ?? 0, currencyCode)}
                  </span>
                </label>
              ))
            )}
            <button
              onClick={handleShippingSubmit}
              disabled={!selectedShippingId || placing}
              className="bg-black text-white text-sm font-semibold py-3.5 px-8 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {placing ? "Saving…" : "Continue to payment"}
            </button>
          </div>
        )}

        {step === "payment" && cart && (
          <div className="space-y-6 max-w-md">
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
                  className="flex-1 min-w-0 border border-gray-200 rounded-lg px-4 py-2 text-xs outline-none focus:border-gray-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={applyingPromo || !promoInput.trim()}
                  className="text-xs font-semibold uppercase tracking-wider border border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-[11px] text-red-500 mt-1.5">{promoError}</p>}
            </div>

            <div className="border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(cart.item_subtotal ?? 0, currencyCode)}</span>
              </div>
              {cart.discount_total > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatPrice(cart.discount_total, currencyCode)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{formatPrice(cart.shipping_total ?? 0, currencyCode)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-100 pt-2">
                <span>Total</span>
                <span>{formatPrice(cart.total ?? 0, currencyCode)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Payment will be processed via the store&apos;s configured payment provider.
            </p>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="bg-black text-white text-sm font-semibold py-3.5 px-8 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {placing ? "Placing order…" : "Place order"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
