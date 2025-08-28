import { Star } from "lucide-react";

export default function StarRating({ rating }: { rating: number }) {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array(fullStars)
        .fill(null)
        .map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-black" />
        ))}
      {halfStar && (
        <Star
          key="half"
          className="size-4 fill-black"
          style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
        />
      )}
      {Array(emptyStars)
        .fill(null)
        .map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="size-4 text-gray-300 fill-gray-300"
          />
        ))}
    </div>
  );
}
