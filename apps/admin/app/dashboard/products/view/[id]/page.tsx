import ViewProductPageClient from "./view-product-page-client";

interface ViewProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewProductPage({
  params,
}: ViewProductPageProps) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <ViewProductPageClient productId={resolvedParams.id} />
      </div>
    </div>
  );
}
