import Image from "next/image";

export default function TextHighlight() {
  return (
    <section className="relative z-10 py-24 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">
      {/* Signature Wave Watermark */}
      <svg
        viewBox="0 0 500 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[120%] text-gray-200/50 -z-10 select-none pointer-events-none"
      >
        <path
          d="M -50,110 C 100,20 200,130 320,40 C 400,100 480,30 550,90"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M -20,130 C 130,40 230,150 350,60 C 430,120 510,50 580,110"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          className="opacity-60"
        />
      </svg>

      <p
        className="text-2xl md:text-4xl lg:text-5xl leading-[1.35] text-[#171717] tracking-tight"
        style={{ fontFamily: "var(--font-nohemi)" }}
      >
        <span className="font-light">Elevate your </span>
        <span className="font-semibold text-black">fashion game</span>
        <span className="font-light"> with our expertly curated collection of </span>
        <span className="font-semibold text-black">high-end</span>{" "}
        <span className="inline-block align-middle mx-1.5 rounded-full overflow-hidden w-16 md:w-20 h-8 md:h-10 relative border border-black/5">
          <Image
            src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80"
            alt="fashion piece"
            fill
            className="object-cover"
          />
        </span>{" "}
        <span className="font-light">pieces. Discover the </span>
        <span className="inline-block align-middle mx-1.5 rounded-full overflow-hidden w-16 md:w-20 h-8 md:h-10 relative border border-black/5">
          <Image
            src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&q=80"
            alt="outfit"
            fill
            className="object-cover"
          />
        </span>{" "}
        <span className="font-semibold text-black">perfect outfit</span>{" "}
        <span className="font-light">for any occasion, from casual to </span>
        <span className="inline-block align-middle mx-1.5 rounded-full overflow-hidden w-16 md:w-20 h-8 md:h-10 relative border border-black/5">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80"
            alt="formal"
            fill
            className="object-cover"
          />
        </span>{" "}
        <span className="font-semibold text-black">formal.</span>
      </p>
    </section>
  );
}
