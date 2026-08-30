import type { Metadata } from "next";
import PolicyLayout, {
  PolicyHeading,
  PolicyText,
} from "../components/PolicyLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `About Us – ${site.brand}`,
  description: `${site.brand} is an online store specialising in trendy and fashionable clothing, curated for those who want to make a statement.`,
};

export default function AboutPage() {
  return (
    <PolicyLayout title={`Your Unique Style with ${site.brand}`}>
      <PolicyText>
        {site.brand} is an e-commerce store specializing in trendy and fashionable clothing. We offer
        unique and stylish options that are perfect for those looking to make a fashion statement. We
        believe fashion is a powerful tool for self-expression, and every piece we carry is chosen to
        reflect the individuality of the person wearing it.
      </PolicyText>

      <PolicyHeading>Stay Up-to-Date with Fashion</PolicyHeading>
      <PolicyText>
        We prioritise curating our collections around current trends, because staying contemporary is
        what keeps a wardrobe alive. Our team follows the season closely so that what you find with
        us is what you want to be wearing right now.
      </PolicyText>

      <PolicyHeading>Quality Focus</PolicyHeading>
      <PolicyText>
        Quality is our top priority at {site.brand}. We take pride in sourcing our products from
        trusted manufacturers who share our commitment to excellence and attention to detail. Each
        item is meticulously selected to meet our standards for durability, comfort and style.
      </PolicyText>

      <PolicyHeading>Customer Satisfaction</PolicyHeading>
      <PolicyText>
        Customer satisfaction is at the heart of everything we do at {site.brand}. Our team provides
        personalised assistance throughout your shopping journey, from choosing the right piece all
        the way through to delivery.
      </PolicyText>

      <PolicyHeading>Reach Us</PolicyHeading>
      <PolicyText>
        {site.address} · {site.phone} · {site.email}
      </PolicyText>
    </PolicyLayout>
  );
}
