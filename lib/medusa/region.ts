import { sdk } from "./client";
import type { HttpTypes } from "@medusajs/types";

let regionPromise: Promise<HttpTypes.StoreRegion> | null = null;

export function getDefaultRegion(): Promise<HttpTypes.StoreRegion> {
  if (!regionPromise) {
    regionPromise = sdk.store.region.list({ limit: 1 }).then(({ regions }) => {
      if (!regions[0]) throw new Error("No region configured on the Medusa store");
      return regions[0];
    });
  }
  return regionPromise;
}
