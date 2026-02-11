import { BookmarkButton } from "@/components/products/bookmark-button";
import { Product } from "@/types/marketplace";
import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import { Card, CardContent } from "@packtok/ui/components/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StarRating from "./star-rating";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Redirect to product details page
    const categorySlug = product.category.name
      .toLowerCase()
      .replace(/\s+/g, "-");
    router.push(`/marketplace/${categorySlug}/${product.id}`);
  };

  const handleMouseEnter = () => {
    // Prefetch product page on hover for instant navigation
    const categorySlug = product.category.name
      .toLowerCase()
      .replace(/\s+/g, "-");
    router.prefetch(`/marketplace/${categorySlug}/${product.id}`);
  };

  // Determine the image source - use thumbnail if available, otherwise first image
  const imageSrc =
    product.imagesThumbnail || product.images[0] || "/placeholder-image.png";

  return (
    <div
      className="flex-shrink-0 w-60 sm:w-72 md:w-80 group cursor-pointer"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <Card className="overflow-hidden rounded-none border-none bg-white relative">
        <CardContent className="p-0">
          <div className="relative h-48 sm:h-64 md:h-80 w-full bg-white">
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 240px, (max-width: 768px) 288px, 320px"
            />
          </div>
          <Badge
            variant="destructive"
            className="absolute top-4 left-4 text-sm border-none bg-white text-black px-3 py-1 font-semibold z-10"
          >
            NEW
          </Badge>
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <BookmarkButton productId={product.id} size="sm" />
          </div>
          <div className="absolute inset-0 bg-black/10 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
            <Button
              size="lg"
              className="text-lg font-bold text-white mb-4 w-full"
            >
              Request Info
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="pt-4 space-y-2 text-left">
        <StarRating rating={5} />
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2">
          {/* Price can be shown if needed */}
        </div>
      </div>
    </div>
  );
}
