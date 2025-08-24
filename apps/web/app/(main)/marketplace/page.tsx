import marketplace2 from "@/assets/marketplace2.png";
import { CategoryList, Newsletter, PageHeader } from "@/components";
import { marketplaceCategories } from "@/constant";

export default function Page() {
  return (
    <main>
      <div className="w-[85%] mx-auto">
        <PageHeader
          title="Marketplace"
          subtitle="Explore Our Machinery & Industrial Solutions."
          image={marketplace2}
        />
        <CategoryList categoryDataList={marketplaceCategories} />
      </div>
      <Newsletter />
    </main>
  );
}
