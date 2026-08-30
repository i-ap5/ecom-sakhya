import type { Metadata } from "next";
import PolicyLayout, {
  PolicyHeading,
  PolicyText,
} from "../components/PolicyLayout";
import { site, POLICY_LAST_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: `Shipping & Delivery – ${site.brand}`,
  description: `Domestic and international shipping timelines, charges and order processing times for ${site.brand}.`,
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping & Delivery" updated={POLICY_LAST_UPDATED}>
      <PolicyText>
        {site.brand} provides shipping services for both domestic and international customers. The
        timelines and charges below apply to all orders placed through our website.
      </PolicyText>

      <PolicyHeading>Domestic Shipping (Within India)</PolicyHeading>
      <PolicyText>
        Standard Shipping: our standard shipping option typically takes 3 to 7 business days to
        deliver your order. Shipping costs vary based on the weight of the order and the destination,
        and are calculated after purchase and communicated to you via email or phone. Tracking
        information is available on request.
      </PolicyText>

      <PolicyHeading>International Shipping</PolicyHeading>
      <PolicyText>
        Standard International Shipping: this option typically takes 10 to 20 business days to
        deliver your order, depending on customs clearance and the destination country. International
        shipping costs are similarly calculated based on weight, dimensions and destination.
      </PolicyText>
      <PolicyText>
        International orders may incur additional duties, taxes and fees upon delivery. These charges
        are not included in the shipping cost and are the responsibility of the customer.
      </PolicyText>

      <PolicyHeading>Order Processing</PolicyHeading>
      <PolicyText>
        All orders are processed within 24 to 48 hours of receiving payment confirmation. Shipping
        costs are finalised during this period.
      </PolicyText>

      <PolicyHeading>Lost or Missing Packages</PolicyHeading>
      <PolicyText>
        If your package goes missing or is lost in transit, please contact our support team with your
        order number and we will investigate on your behalf.
      </PolicyText>

      <PolicyHeading>Contact</PolicyHeading>
      <PolicyText>
        For any shipping enquiries, reach us at {site.email} or on WhatsApp at {site.phone}, available{" "}
        {site.supportHours}. Our address is {site.address}.
      </PolicyText>
    </PolicyLayout>
  );
}
