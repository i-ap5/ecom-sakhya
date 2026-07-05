"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCustomer } from "../context/CustomerContext";
import { createCustomerAddress, deleteCustomerAddress, listCustomerOrders } from "@/lib/medusa/customer";
import { formatPrice } from "@/lib/medusa/products";
import { getDefaultRegion } from "@/lib/medusa/region";

type Tab = "orders" | "addresses";

const emptyAddress = {
  first_name: "",
  last_name: "",
  address_1: "",
  city: "",
  postal_code: "",
  province: "",
  phone: "",
};

export default function AccountPage() {
  const router = useRouter();
  const { customer, loading, logout, refresh } = useCustomer();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<HttpTypes.StoreOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!loading && !customer) {
      router.push("/account/login");
    }
  }, [loading, customer, router]);

  useEffect(() => {
    if (!customer) return;
    listCustomerOrders()
      .then(setOrders)
      .catch((error) => console.error("Failed to load orders", error))
      .finally(() => setOrdersLoading(false));
  }, [customer]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const region = await getDefaultRegion();
      const countryCode = region.countries?.[0]?.iso_2 ?? "in";
      await createCustomerAddress({ ...newAddress, country_code: countryCode });
      await refresh();
      setNewAddress(emptyAddress);
    } catch (error) {
      console.error("Failed to add address", error);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    await deleteCustomerAddress(addressId);
    await refresh();
  };

  if (loading || !customer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading…</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-nohemi)" }}>
              Hi, {customer.first_name}
            </h1>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="text-xs font-semibold uppercase tracking-wider border border-gray-200 rounded-full px-4 py-2 hover:border-black transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="flex gap-6 border-b border-gray-200 mb-6 text-sm font-semibold uppercase tracking-wider">
          <button
            onClick={() => setTab("orders")}
            className={`pb-3 ${tab === "orders" ? "border-b-2 border-black text-black" : "text-gray-400"}`}
          >
            Orders
          </button>
          <button
            onClick={() => setTab("addresses")}
            className={`pb-3 ${tab === "addresses" ? "border-b-2 border-black text-black" : "text-gray-400"}`}
          >
            Addresses
          </button>
        </div>

        {tab === "orders" && (
          <div className="space-y-3">
            {ordersLoading ? (
              <p className="text-sm text-gray-400">Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-gray-400">You haven&apos;t placed any orders yet.</p>
            ) : (
              orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold">Order #{order.display_id}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(order.total ?? 0, order.currency_code)}</p>
                </Link>
              ))
            )}
          </div>
        )}

        {tab === "addresses" && (
          <div className="space-y-8">
            {customer.addresses && customer.addresses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-100 rounded-xl p-4 text-sm space-y-0.5">
                    <p className="font-semibold">
                      {addr.first_name} {addr.last_name}
                    </p>
                    <p className="text-gray-500">{addr.address_1}</p>
                    <p className="text-gray-500">
                      {addr.city}, {addr.province} {addr.postal_code}
                    </p>
                    <p className="text-gray-500">{addr.phone}</p>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-red-500 hover:underline mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddAddress} className="space-y-3 max-w-md">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Add a new address</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="First name"
                  value={newAddress.first_name}
                  onChange={(e) => setNewAddress({ ...newAddress, first_name: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
                />
                <input
                  required
                  placeholder="Last name"
                  value={newAddress.last_name}
                  onChange={(e) => setNewAddress({ ...newAddress, last_name: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <input
                required
                placeholder="Address"
                value={newAddress.address_1}
                onChange={(e) => setNewAddress({ ...newAddress, address_1: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
                />
                <input
                  required
                  placeholder="Postal code"
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="State / Province"
                  value={newAddress.province}
                  onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
                />
                <input
                  required
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={savingAddress}
                className="bg-black text-white text-sm font-semibold py-3 px-6 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                {savingAddress ? "Saving…" : "Add address"}
              </button>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
