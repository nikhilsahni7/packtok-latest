"use client";

import { useVendorProducts } from "@/hooks";
import { Button, Card } from "@packtok/ui";
import Image from "next/image";
import Link from "next/link";

export default function VendorProductsPage() {
  const { data, isLoading, isError } = useVendorProducts();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/vendor/products/new">
          <Button>+ New product</Button>
        </Link>
      </div>

      {isLoading && <div>Loading…</div>}
      {isError && (
        <div className="text-sm text-red-600">Failed to load products.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data ?? []).map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden">
                {p.imagesThumbnail ? (
                  <Image
                    src={p.imagesThumbnail}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">
                  {p.title}
                </div>
                <div className="text-xs text-gray-600">
                  {p.submissionStatus ?? "—"} / {p.status}
                </div>
              </div>
              <Link
                href={`/vendor/products/${p.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
