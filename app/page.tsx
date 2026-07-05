import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import ShopByCategory from "./components/ShopByCategory";
import TextHighlight from "./components/TextHighlight";
import NewCollections from "./components/NewCollections";
import FeaturedProduct from "./components/FeaturedProduct";
import TrendingNow from "./components/TrendingNow";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <ShopByCategory />
        <TextHighlight />
        <NewCollections />
        <FeaturedProduct />
        <TrendingNow />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
