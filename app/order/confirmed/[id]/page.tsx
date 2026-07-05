"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductImage from "../../../components/ProductImage";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { retrieveOrder } from "@/lib/medusa/customer";
import { formatPrice } from "@/lib/medusa/products";

export default function OrderConfirmedPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null | undefined>(undefined);

  useEffect(() => {
    retrieveOrder(params.id)
      .then(setOrder)
      .catch((error) => {
        console.error("Failed to load order", error);
        setOrder(null);
      });
  }, [params.id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-16 max-w-3xl mx-auto w-full">
        {order === undefined && <p className="text-center text-sm text-gray-400">Loading…</p>}

        {order === null && (
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold">We couldn&apos;t find that order</p>
            <Link href="/shop" className="text-sm underline text-gray-500 hover:text-black">
              Continue shopping
            </Link>
          </div>
        )}

        {order && (
          <>
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "var(--font-nohemi)" }}>
                Thank you, {order.shipping_address?.first_name}!
              </h1>
              <p className="text-sm text-gray-500">
                Your order <strong>#{order.display_id}</strong> has been placed.
              </p>
            </div>

            <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 p-4">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {item.thumbnail && (
                      <ProductImage src={item.thumbnail} alt={item.product_title ?? item.title} fill className="object-cover object-top" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.product_title ?? item.title}</p>
                    {item.variant_title && <p className="text-xs text-gray-400">{item.variant_title}</p>}
                    <p className="text-xs text-gray-400 mt-1">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.total ?? item.unit_price * item.quantity, order.currency_code)}
                  </p>
                </div>
              ))}
              <div className="p-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.item_subtotal ?? 0, order.currency_code)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_total ?? 0, order.currency_code)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(order.total ?? 0, order.currency_code)}</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/shop" className="text-sm underline text-gray-500 hover:text-black">
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
