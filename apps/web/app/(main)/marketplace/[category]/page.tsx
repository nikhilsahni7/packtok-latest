import { Newsletter, PageHeader } from "@/components";
import { marketplaceCategories } from "@/constant";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryContent from "./components/category-content";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    searchTerm?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = marketplaceCategories.find(
    (cat) => cat.slug === resolvedParams.category
  );

  if (!category) {
    return {
      title: "Category Not Found | Packtok",
    };
  }

  return {
    title: `${category.title} | Packtok Marketplace`,
    description: category.subtitle || `Browse our collection of ${category.title} products.`,
    openGraph: {
      title: `${category.title} | Packtok Marketplace`,
      description: category.subtitle,
      images: category.image ? [{ url: category.image.src }] : [],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  // Next.js 16: params and searchParams are now Promises and must be awaited
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = resolvedParams.category;
  const category = marketplaceCategories.find(
    (cat) => cat.slug === categorySlug
  );

  if (!category) {
    notFound();
  }

  return (
    <main>
      <div className="w-full mx-auto">
        <PageHeader
          title={category.title}
          subtitle={category.subtitle}
          image={category.image}
        />

      </div>

      <div className="container mx-auto  px-4">
        <CategoryContent
          category={category}
          initialSearchTerm={resolvedSearchParams.searchTerm}
        />
      </div>
      <Newsletter />
    </main>
  );
}
