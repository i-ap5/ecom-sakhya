// Deterministic placeholder rating derived from the product id, so the same
// product always shows the same rating/review count until a real reviews
// system exists.
export function getProductRating(productId: string): { rating: number; reviewCount: number } {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = (hash * 31 + productId.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);
  const rating = 4 + ((abs % 11) / 10); // 4.0 - 5.0 in steps of 0.1
  const reviewCount = 18 + (abs % 230); // 18 - 247
  return { rating: Math.round(rating * 10) / 10, reviewCount };
}
