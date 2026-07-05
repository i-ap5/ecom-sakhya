import Medusa from "@medusajs/js-sdk";

const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

if (!backendUrl || !publishableKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY env vars"
  );
}

export const sdk = new Medusa({
  baseUrl: backendUrl.replace(/\/+$/, ""),
  publishableKey,
  auth: {
    type: "jwt",
    jwtTokenStorageMethod: "local",
  },
});
