import type { Metadata } from "next";
import PolicyLayout, {
  PolicyHeading,
  PolicyList,
  PolicyText,
} from "../components/PolicyLayout";
import { site, POLICY_LAST_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy – ${site.brand}`,
  description: `How ${site.brand} collects, uses and safeguards the personal information you provide to us.`,
};

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" updated={POLICY_LAST_UPDATED}>
      <PolicyText>
        At {site.brand}, we understand the importance of protecting your personal information. This
        Privacy Policy outlines how we collect, use, and safeguard the information you provide to us
        when using our website.
      </PolicyText>

      <PolicyHeading>Information We Collect</PolicyHeading>
      <PolicyText>
        When you visit our website, we may collect certain information about your browsing behavior,
        such as the pages you visit and the links you click on. This information helps us analyze
        trends, improve our website, and enhance your overall shopping experience.
      </PolicyText>
      <PolicyText>
        In addition, when you make a purchase or create an account on our website, we may collect
        personal information such as your name, email address, shipping address, and payment details.
        This information is necessary to process your order and provide you with the products and
        services you requested.
      </PolicyText>

      <PolicyHeading>How We Use Your Information</PolicyHeading>
      <PolicyText>The information we collect from you is used for various purposes, including:</PolicyText>
      <PolicyList
        items={[
          "Processing and fulfilling your orders",
          "Providing customer support and responding to your inquiries",
          "Improving our website and services",
          "Communicating with you about promotions, offers, and new products",
          "Preventing fraudulent activities and ensuring the security of our website",
        ]}
      />

      <PolicyHeading>Sharing Your Information</PolicyHeading>
      <PolicyText>
        We may share your personal information with third-party service providers who assist us in
        operating our website, conducting our business, and providing you with the products and
        services you requested. These service providers are contractually obligated to keep your
        information confidential and secure.
      </PolicyText>
      <PolicyText>
        We may also share your information when required by law or to protect our rights, property,
        or safety, as well as the rights, property, and safety of our customers and others.
      </PolicyText>

      <PolicyHeading>Security Measures</PolicyHeading>
      <PolicyText>
        We take the security of your personal information seriously and have implemented various
        measures to protect it from unauthorized access, disclosure, alteration, or destruction.
        These measures include encryption, secure socket layer (SSL) technology, and regular security
        audits.
      </PolicyText>
      <PolicyText>
        Payments made on our website are processed by our payment gateway partner. Your card and
        banking details are entered directly with the payment gateway and are never stored on our
        servers.
      </PolicyText>

      <PolicyHeading>Updating Your Information</PolicyHeading>
      <PolicyText>
        If you need to update or correct the personal information you provided to us, you can do so
        by logging into your account on our website or contacting our customer support team.
      </PolicyText>

      <PolicyHeading>Changes to This Privacy Policy</PolicyHeading>
      <PolicyText>
        We may update this Privacy Policy from time to time to reflect changes in our practices or
        legal requirements. We encourage you to review this page periodically for any updates. Your
        continued use of our website after any changes to this Privacy Policy constitutes your
        acceptance of those changes.
      </PolicyText>

      <PolicyHeading>Contact Us</PolicyHeading>
      <PolicyText>
        If you have any questions or concerns about our Privacy Policy or the way we handle your
        personal information, please contact us at {site.email}.
      </PolicyText>
    </PolicyLayout>
  );
}
