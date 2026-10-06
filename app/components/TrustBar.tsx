const FEATURES = [
  {
    title: "Free Shipping",
    description: "On orders over ₹2,000",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-12H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h2.25M14.25 6.75v11.25" />
    ),
  },
  {
    title: "Secure Payments",
    description: "100% protected checkout",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  },
  {
    title: "Easy Returns",
    description: "14-day return window",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    ),
  },
  {
    title: "Quality Assured",
    description: "Curated & checked designs",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    ),
  },
];

export default function TrustBar() {
  return (
    <section className="px-6 md:px-16 lg:px-28 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 py-6 border-b border-gray-100">
        {FEATURES.map((feature) => (
          <div key={feature.title} title={feature.description} className="flex items-center md:justify-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3} className="shrink-0 text-gray-800">
              {feature.icon}
            </svg>
            <p className="text-sm text-[#171717]">{feature.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
