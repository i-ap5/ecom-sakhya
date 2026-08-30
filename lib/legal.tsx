import { site } from "./site";

/**
 * Shared preamble used by both the Terms & Conditions and the
 * Refunds/Cancellations pages.
 */
export function LegalPreamble() {
  return (
    <p className="text-sm text-gray-600 leading-relaxed mb-4">
      For the purpose of these Terms and Conditions, the term &quot;we&quot;, &quot;us&quot;,
      &quot;our&quot; used anywhere on this page shall mean {site.legalName}, whose
      registered/operational office is {site.address}. &quot;You&quot;, &quot;your&quot;,
      &quot;user&quot;, &quot;visitor&quot; shall mean any natural or legal person who is visiting
      our website and/or agreed to purchase from us.
    </p>
  );
}

/**
 * The clauses common to both the Terms & Conditions and the
 * Refunds/Cancellations pages. Each page appends its own extra clauses.
 */
export const COMMON_TERMS: React.ReactNode[] = [
  "The content of the pages of this website is subject to change without notice.",

  "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",

  "Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.",

  "Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.",

  "All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.",

  "Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.",

  "From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.",

  <>
    You may not create a link to our website from another website or document without{" "}
    {site.legalName}&apos;s prior written consent.
  </>,

  <>
    Any dispute arising out of use of our website and/or purchase with us and/or any engagement with
    us is subject to the laws of {site.country}.
  </>,

  "We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.",
];
