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

export default function AccountOrderDetailPage() {
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
      <main className="flex-1 px-6 md:px-12 py-12 max-w-3xl mx-auto w-full">
        <Link href="/account" className="text-xs text-gray-400 hover:text-black uppercase tracking-wider">
          ← Back to account
        </Link>

        {order === undefined && <p className="text-sm text-gray-400 mt-6">Loading…</p>}
        {order === null && <p className="text-sm text-gray-400 mt-6">Order not found.</p>}

        {order && (
          <>
            <h1 className="text-2xl font-semibold mt-4 mb-1" style={{ fontFamily: "var(--font-nohemi)" }}>
              Order #{order.display_id}
            </h1>
            <p className="text-sm text-gray-400 mb-6">{new Date(order.created_at).toLocaleDateString()}</p>

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

            {order.shipping_address && (
              <div className="mt-8 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Shipping to</p>
                <p>
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-gray-500">{order.shipping_address.address_1}</p>
                <p className="text-gray-500">
                  {order.shipping_address.city}, {order.shipping_address.province}{" "}
                  {order.shipping_address.postal_code}
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
