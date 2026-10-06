import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import ShopByCategory from "./components/ShopByCategory";
import NewCollections from "./components/NewCollections";
import CampaignBanner from "./components/CampaignBanner";
import TrendingNow from "./components/TrendingNow";
import BrandStory from "./components/BrandStory";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Spacing lives here (not on sections) so gaps stay even when a section renders nothing */}
      <main className="flex-1 flex flex-col gap-16 md:gap-24 pb-16 md:pb-24">
        <div>
          <Hero />
          <TrustBar />
        </div>
        <ShopByCategory />
        {/* TextHighlight hidden for now — kept in app/components/TextHighlight.tsx to re-enable later */}
        <NewCollections />
        {/* FeaturedProduct hidden — duplicated the first New Arrivals item; kept in app/components/FeaturedProduct.tsx */}
        <CampaignBanner />
        <TrendingNow />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
