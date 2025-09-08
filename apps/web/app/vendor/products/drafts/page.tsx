import Link from "next/link";

export default function VendorDraftsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Drafts</h1>
      <p className="text-sm text-gray-600">
        Filter of drafts can be added later.
      </p>
      <Link href="/vendor/products/new" className="text-blue-600 underline">
        + Create New Product
      </Link>
    </div>
  );
}
