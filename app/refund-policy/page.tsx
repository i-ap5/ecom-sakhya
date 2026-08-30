import type { Metadata } from "next";
import PolicyLayout, {
  PolicyHeading,
  PolicyList,
  PolicyText,
} from "../components/PolicyLayout";
import { site, POLICY_LAST_UPDATED } from "@/lib/site";
import { COMMON_TERMS, LegalPreamble } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Refunds & Cancellations – ${site.brand}`,
  description: `The ${site.brand} refund, cancellation and return policy, including timelines for processing approved refunds.`,
};

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refunds / Cancellations" updated={POLICY_LAST_UPDATED}>
      <LegalPreamble />

      <PolicyHeading>
        Your use of the website and/or purchase from us are governed by the following Terms and
        Conditions
      </PolicyHeading>
      <PolicyList
        items={[
          ...COMMON_TERMS,
          "In case of any refunds approved, it will take 3–7 days for the refund to be processed to the original payment method.",
        ]}
      />

      <PolicyHeading>Return Policy</PolicyHeading>
      <PolicyText>
        We gladly offer exchanges for items that remain in their original condition – unworn, unused,
        unwashed, unaltered, undamaged, and with all original tags intact. Please ensure that you
        request an exchange within 48 hours from the date of delivery. Please note that return
        shipping charges may apply.
      </PolicyText>

      <PolicyHeading>How to Request a Return or Cancellation</PolicyHeading>
      <PolicyText>
        To request an exchange, cancellation or refund, contact us at {site.email} or call{" "}
        {site.phone} with your order number. Our team is available {site.supportHours}.
      </PolicyText>
    </PolicyLayout>
  );
}
