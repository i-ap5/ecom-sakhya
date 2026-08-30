"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { site } from "@/lib/site";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Opens the visitor's mail client with the message pre-filled. This keeps the
  // form working without a mail backend, which the storefront doesn't have.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 md:py-16 max-w-5xl mx-auto w-full">
        <header className="text-center mb-12">
          <h1
            className="text-3xl md:text-5xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-nohemi)" }}
          >
            Get In Touch
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Questions about an order, a size or a return? Our team is here to help.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          {/* Contact details */}
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Address</p>
              <p className="text-sm text-gray-600 leading-relaxed">{site.address}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Phone &amp; WhatsApp
              </p>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                {site.phone}
              </a>
              <p className="text-xs text-gray-400 mt-1">
                Orders, returns and exchanges · {site.supportHours}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-gray-600 underline hover:text-black transition-colors"
              >
                {site.email}
              </a>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Follow</p>
              <div className="flex gap-4 text-sm text-gray-600">
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <input
              type="email"
              required
              placeholder="Your email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              required
              placeholder="Subject *"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClass}
            />
            <textarea
              rows={6}
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClass} resize-none`}
            />
            <button
              type="submit"
              className="bg-black text-white text-sm font-semibold py-3.5 px-8 rounded-full hover:bg-gray-800 transition-colors"
            >
              Send message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
