"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { useCart } from "../context/CartContext";
import AnnouncementBar from "./AnnouncementBar";
import SearchModal from "./SearchModal";
import { listCategories } from "@/lib/medusa/products";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<HttpTypes.StoreProductCategory[]>([]);
  const { cartCount, setCartOpen } = useCart();

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((error) => console.error("Failed to load nav categories", error));
  }, []);

  const navLinks = [
    { label: "New Arrivals", href: "/shop" },
    { label: "All Product", href: "/shop" },
  ];

  return (
    <>
      <AnnouncementBar />
      <nav className="w-full px-6 md:px-12 py-4 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-nohemi)" }}>
        SAGHYA
      </Link>

      {/* Desktop Nav */}
      <ul className="hidden md:flex items-center gap-8 text-sm text-gray-700 font-medium">
        {categories.length > 0 && (
          <li
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-black transition-colors cursor-pointer">
              Categories
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {categoriesOpen && (
              <div className="absolute top-full left-0 pt-3 w-48">
                <div className="bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>
        )}
        {navLinks.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="hover:text-black transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right Actions */}
      <div className="hidden md:flex items-center gap-5">
        <button
          onClick={() => setSearchOpen(true)}
          className="text-gray-700 hover:text-black transition-colors"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
        <Link href="/account" className="text-gray-700 hover:text-black transition-colors" aria-label="Account">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </Link>
        <button
          onClick={() => setCartOpen(true)}
          className="relative text-gray-750 hover:text-black transition-colors flex items-center justify-center p-1.5"
          aria-label="Open cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Actions & Hamburger */}
      <div className="flex items-center gap-4 md:hidden">
        <button
          onClick={() => setSearchOpen(true)}
          className="text-gray-700 p-1"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
        <button
          onClick={() => setCartOpen(true)}
          className="relative text-gray-750 hover:text-black transition-colors flex items-center justify-center p-1.5"
          aria-label="Open cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </button>

        <button
          className="text-gray-700 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 py-4 px-6 flex flex-col gap-4 md:hidden shadow-lg z-50">
          {categories.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Categories</p>
              <div className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-700 hover:text-black py-1 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700 hover:text-black py-1 transition-colors"
          >
            Account
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              setCartOpen(true);
            }}
            className="w-full bg-black text-white text-sm py-2.5 rounded-full text-center hover:bg-gray-800 transition-colors"
          >
            View Bag ({cartCount})
          </button>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      </nav>
    </>
  );
}
