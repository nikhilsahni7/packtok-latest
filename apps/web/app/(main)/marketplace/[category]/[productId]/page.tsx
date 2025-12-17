import { Newsletter } from "@/components";
import { notFound } from "next/navigation";
import ProductDetails from "./components/product-details";

interface ProductPageProps {
  params: Promise<{
    category: string;
    productId: string;
  }>;
}

async function getProduct(productId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${productId}`,
      {
        next: { revalidate: 180 }, // 3 minutes - balance freshness with performance
      }
    );
    console.log("Fetching product:", response);

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Next.js 16: params is now a Promise and must be awaited
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);
  console.log("Product data:", product);
  if (!product) {
    notFound();
  }

  return (
    <main>
      <div className="w-[85%] mt-16 mx-auto">
        <ProductDetails product={product.data} />
      </div>
      <Newsletter />
    </main>
  );
}
