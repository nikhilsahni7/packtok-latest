import EditProductPageClient from "./edit-product-page-client";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Next.js 16: params is now a Promise and must be awaited
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <EditProductPageClient productId={resolvedParams.id} />
      </div>
    </div>
  );
}
