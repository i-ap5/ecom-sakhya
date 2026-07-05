export default function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? 11 : 14;
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className={`flex items-center gap-1 ${textSize} text-gray-400`}>
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width={starSize}
              height={starSize}
              viewBox="0 0 20 20"
              fill={filled ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={filled ? 0 : 1.2}
            >
              <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.61 1-5.79-4.21-4.1 5.82-.85z" />
            </svg>
          );
        })}
      </div>
      <span className="font-semibold text-gray-600">{rating.toFixed(1)}</span>
      <span>({reviewCount})</span>
    </div>
  );
}
