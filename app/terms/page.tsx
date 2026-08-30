import type { Metadata } from "next";
import PolicyLayout, {
  PolicyHeading,
  PolicyList,
  PolicyText,
} from "../components/PolicyLayout";
import { site, POLICY_LAST_UPDATED } from "@/lib/site";
import { COMMON_TERMS, LegalPreamble } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Terms & Conditions – ${site.brand}`,
  description: `The terms and conditions governing your use of the ${site.brand} website and any purchase made from us.`,
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" updated={POLICY_LAST_UPDATED}>
      <LegalPreamble />

      <PolicyHeading>
        Your use of the website and/or purchase from us are governed by the following Terms and
        Conditions
      </PolicyHeading>
      <PolicyList
        items={[
          ...COMMON_TERMS,
          "For international buyers, orders are shipped and delivered through registered international courier companies and/or international speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.",
        ]}
      />

      <PolicyHeading>Pricing Policy</PolicyHeading>
      <PolicyText>
        Our products are competitively priced, with clear pricing displayed on each item page. We
        occasionally offer discounts and promotions, which are clearly communicated to customers.
      </PolicyText>

      <PolicyHeading>Payment Terms</PolicyHeading>
      <PolicyList
        items={[
          "All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes.",
          "We accept various payment methods, including credit cards, debit cards, net banking and UPI.",
          "Payments are processed securely through our payment gateway partner. Your card and banking details are entered directly with the payment gateway and are never stored on our servers.",
          "In case of order cancellation or return, the refund will be processed to the original payment method.",
        ]}
      />

      <PolicyHeading>Contact</PolicyHeading>
      <PolicyText>
        For any questions about these terms, contact us at {site.email} or call {site.phone}.
      </PolicyText>
    </PolicyLayout>
  );
}
