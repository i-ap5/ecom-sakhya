import Link from "next/link";

export default function SectionHeader({
  title,
  linkHref,
  linkLabel = "View all",
  children,
}: {
  title: string;
  linkHref?: string;
  linkLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-6 md:mb-8">
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight">{title}</h2>
      <div className="flex items-center gap-5 shrink-0">
        {children}
        {linkHref && (
          <Link
            href={linkHref}
            className="text-sm font-medium underline underline-offset-4 decoration-gray-300 hover:decoration-black transition-colors"
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
