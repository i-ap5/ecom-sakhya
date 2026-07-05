import Image, { type ImageProps } from "next/image";

function isLocalUrl(src: string): boolean {
  try {
    const { hostname } = new URL(src);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}

// Next.js's image optimizer blocks upstream URLs that resolve to a private/loopback
// IP (SSRF protection), which includes "localhost" — so images served straight from
// a local Medusa backend must skip optimization instead of going through /_next/image.
export default function ProductImage({ alt, ...props }: ImageProps) {
  const unoptimized = typeof props.src === "string" && isLocalUrl(props.src);
  return <Image {...props} alt={alt} unoptimized={unoptimized} />;
}
