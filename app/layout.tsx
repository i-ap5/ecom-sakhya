import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Bodoni_Moda, Cinzel, Italiana, Tenor_Sans, Syne, Playfair_Display, Montserrat, Instrument_Serif, Great_Vibes, Prata, Sacramento, Abril_Fatface, Cinzel_Decorative } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sacramento",
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-abril",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzeldec",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-greatvibes",
});

const prata = Prata({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-prata",
});
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { CustomerProvider } from "./context/CustomerContext";
import CartDrawer from "./components/CartDrawer";

const nohemi = localFont({
  src: [
    {
      path: "./fonts/nohemi/Nohemi-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/nohemi/Nohemi-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/nohemi/Nohemi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/nohemi/Nohemi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/nohemi/Nohemi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/nohemi/Nohemi-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/nohemi/Nohemi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/nohemi/Nohemi-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/nohemi/Nohemi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
});

const italiana = Italiana({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-italiana",
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-tenor",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Label We – Timeless Luxury, Redefined",
  description:
    "Fashion website dedicated to showcasing the latest trends and providing inspiration for fashion-conscious individuals.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${nohemi.variable} ${cormorant.variable} ${bodoni.variable} ${cinzel.variable} ${italiana.variable} ${tenorSans.variable} ${syne.variable} ${playfair.variable} ${montserrat.variable} ${instrumentSerif.variable} ${greatVibes.variable} ${prata.variable} ${sacramento.variable} ${abrilFatface.variable} ${cinzelDecorative.variable}`}
    >
      <body className="min-h-full bg-white text-[#171717] antialiased">
        <CustomerProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </CustomerProvider>
      </body>
    </html>
  );
}
