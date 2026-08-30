"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";
import { listCategories } from "@/lib/medusa/products";
import { site } from "@/lib/site";

export default function Footer() {
  const [categories, setCategories] = useState<HttpTypes.StoreProductCategory[]>([]);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((error) => console.error("Failed to load footer categories", error));
  }, []);

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-tenor), sans-serif" }}
          >
            {site.brand}
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mt-3">
            Timeless, hand-curated womenswear — modern silhouettes and everyday staples, made for her.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Shop</p>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li>
              <Link href="/shop" className="hover:text-black transition-colors">
                All Products
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/shop?category=${cat.id}`} className="hover:text-black transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Account</p>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li>
              <Link href="/account" className="hover:text-black transition-colors">
                My Account
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-black transition-colors">
                Order History
              </Link>
            </li>
            <li>
              <Link href="/account/login" className="hover:text-black transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/account/register" className="hover:text-black transition-colors">
                Create Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Company</p>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li>
              <Link href="/about" className="hover:text-black transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-black transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-black transition-colors">
                Shipping &amp; Delivery
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-black transition-colors">
                Refunds &amp; Cancellations
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-black transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-black transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <p>© 2026 {site.brand}. All rights reserved.</p>
        <p>
          Made by{" "}
          <a
            href="https://trowcode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            trowcode
          </a>
        </p>
      </div>
    </footer>
  );
}
