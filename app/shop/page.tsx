"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { listProducts, listCategories } from "@/lib/medusa/products";

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const { addToCart, currencyCode } = useCart();
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [categories, setCategories] = useState<HttpTypes.StoreProductCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.get("category"));
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [loadedFor, setLoadedFor] = useState<string>("none");
  const requestKey = `${activeCategory ?? "all"}:${searchQuery}`;
  const loading = loadedFor !== requestKey;

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((error) => console.error("Failed to load categories", error));
  }, []);

  useEffect(() => {
    const key = `${activeCategory ?? "all"}:${searchQuery}`;
    listProducts({ limit: 50, categoryId: activeCategory ?? undefined, q: searchQuery || undefined })
      .then(({ products }) => {
        setProducts(products);
        setLoadedFor(key);
      })
      .catch((error) => console.error("Failed to load products", error));
  }, [activeCategory, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-semibold mb-3" style={{ fontFamily: "var(--font-nohemi)" }}>
            {searchQuery ? `Results for "${searchQuery}"` : "Shop All"}
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Explore the full Saghya collection, curated for her.
          </p>
          <form onSubmit={handleSearchSubmit} className="flex justify-center gap-2 mt-6 max-w-sm mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              className="flex-1 min-w-0 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
            />
            <button
              type="submit"
              className="text-xs font-semibold uppercase tracking-wider border border-black rounded-full px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === null
                  ? "bg-black text-white"
                  : "bg-gray-50 border border-gray-200 text-gray-500 hover:text-black"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? "bg-black text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-500 hover:text-black"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-20">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-20">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} currencyCode={currencyCode} onQuickAdd={addToCart} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
