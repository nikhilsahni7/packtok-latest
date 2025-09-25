import { Card, CardContent } from "@packtok/ui/components/card";
import { Badge } from "@packtok/ui/components/badge";
import { Button } from "@packtok/ui/components/button";
import StarRating from "./star-rating";
// import machinery from "@/assets/machinery.png";
import Image, { StaticImageData } from "next/image";
interface ProductCardProps {
  product: {
    rating: number;
    name: string;
    originalPrice: number;
    image: string | StaticImageData;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex-shrink-0 w-60 sm:w-72 md:w-80 group">
      <Card className="overflow-hidden rounded-none border-none bg-gray-100 relative">
        <CardContent className="p-0">
          {/* <div className="relative"> */}
            <Image
              src={product.image}
              alt={product.name}
              className="h-48 sm:h-64 md:h-80 w-full object-contain"
            />
            <Badge
              variant="destructive"
              className="absolute top-4 left-4 text-sm border-none bg-white text-black px-3 py-1 font-semibold"
            >
              NEW
            </Badge>
            <div className="absolute inset-0 bg-black/10 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 cursor-pointer">
              <Button size="lg" className="text-lg font-bold text-white mb-4 w-full">
                Request Info
              </Button>
            </div>
          {/* </div> */}
        </CardContent>
      </Card>
      <div className="pt-4 space-y-2 text-left">
        <StarRating rating={product.rating} />
        <h3 className="text-base font-semibold text-gray-800">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          {/* <p className="text-base font-semibold text-gray-900">
            ${product.price}
          </p> */}
          {/* <p className="text-sm sm:text-base text-gray-400 line-through">
            ${product.originalPrice}
          </p> */}
        </div>
      </div>
    </div>
  );
}
