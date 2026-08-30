/**
 * Business details shown on the policy / contact pages.
 *
 * `legalName` and `address` are taken from the GST registration
 * (GSTIN 32AKMPA5274G1ZD) and must stay character-for-character identical to
 * the details on the Razorpay account — Razorpay verifies them against the KYC
 * documents during merchant activation.
 */
export const site = {
  /** Customer-facing brand name. */
  brand: "Label We",

  /** Registered legal entity name, as on the GST registration. */
  legalName: "AVN OUTFITS",

  /** Registered / operational office address. */
  address:
    "Door No. 13/149, V P Complex, Poovattuparamba, Kozhikode, Kerala – 673008",

  /** Primary support contact. */
  email: "hello@labelwe.com",

  /** General, returns and exchange queries. Reachable on WhatsApp. */
  phone: "+91 90489 87528",

  supportHours: "24/7",

  /** Country of operation, used in the governing-law clauses. */
  country: "India",

  /**
   * GST identification number. Not rendered anywhere yet — add it to the
   * footer or contact page if you want it displayed.
   */
  gstin: "32AKMPA5274G1ZD",

  social: {
    instagram: "https://www.instagram.com/label_we",
    facebook: "https://www.facebook.com/profile.php?id=61593583876540",
  },
} as const;

/** Date shown as "Last updated" across the policy pages. */
export const POLICY_LAST_UPDATED = "30 August 2026";
