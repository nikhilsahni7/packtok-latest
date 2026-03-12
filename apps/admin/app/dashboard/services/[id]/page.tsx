"use client";

import { Button } from "@packtok/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useService } from "../../../../hooks/useServices";
import { ServiceDetailView } from "../_components/service-detail-view";

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const {
    data: service,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useService(params.id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-8 w-64 rounded bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-200" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 rounded bg-gray-200" />
            <div className="h-10 w-32 rounded bg-gray-200" />
            <div className="h-10 w-24 rounded bg-gray-200" />
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-4 w-20 rounded bg-gray-200 mb-4" />
              <div className="h-6 w-32 rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Details skeleton */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="h-6 w-40 rounded bg-gray-200 mb-6" />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Service not found
          </h2>
          <p className="text-gray-500 mb-4">
            The service you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </p>
          <Link href="/dashboard/services">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/services">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </Link>
        <Button
          type="button"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <ServiceDetailView service={service} />
    </div>
  );
}
