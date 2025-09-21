import { notFound } from "next/navigation";
import { PageHeader, Newsletter } from "@/components";
import { marketplaceCategories } from "@/constant";
import CategoryContent from "./components/category-content";

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    searchTerm?: string;
    [key: string]: string | string[] | undefined;
  };
}

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const categorySlug = params.category;
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
          initialSearchTerm={searchParams.searchTerm}
        />
      </div>
      <Newsletter />
    </main>
  );
}
