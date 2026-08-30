import Navbar from "./Navbar";
import Footer from "./Footer";

export function PolicyHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base md:text-lg font-semibold mt-10 mb-3 first:mt-0">{children}</h2>
  );
}

export function PolicyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600 leading-relaxed mb-4">{children}</p>;
}

export function PolicyList({ items, ordered = false }: { items: React.ReactNode[]; ordered?: boolean }) {
  const className = `${
    ordered ? "list-decimal" : "list-disc"
  } pl-5 space-y-2.5 text-sm text-gray-600 leading-relaxed mb-4 marker:text-gray-300`;

  const children = items.map((item, i) => <li key={i}>{item}</li>);

  return ordered ? <ol className={className}>{children}</ol> : <ul className={className}>{children}</ul>;
}

export default function PolicyLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 md:py-16 max-w-3xl mx-auto w-full">
        <header className="mb-10 pb-8 border-b border-gray-100">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-3"
            style={{ fontFamily: "var(--font-nohemi)" }}
          >
            {title}
          </h1>
          {updated && (
            <p className="text-xs uppercase tracking-wider text-gray-400">Last updated on {updated}</p>
          )}
        </header>
        {children}
      </main>
      <Footer />
    </div>
  );
}
