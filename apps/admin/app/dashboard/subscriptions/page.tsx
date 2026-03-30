"use client";

import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { useMemo, useState } from "react";
import { useEmailSubscriptions } from "../../../hooks/useEmailSubscriptions";

type FilterType = "ALL" | "NEWSLETTER" | "PODCAST";

export default function SubscriptionsPage() {
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch, isFetching } =
    useEmailSubscriptions({
      page: 1,
      limit: 200,
      type: filterType === "ALL" ? undefined : filterType,
    });

  const rows = useMemo(() => {
    const list = data?.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => item.email.toLowerCase().includes(q));
  }, [data?.data, search]);

  return (
    <div className="p-8 space-y-6 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Subscriptions</h1>
          <p className="text-sm text-slate-600 mt-1">
            View newsletter and podcast email subscribers.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500">
            Total Subscribers
          </p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {data?.summary.totalAll ?? 0}
          </p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500">Newsletter</p>
          <p className="text-3xl font-black text-orange-600 mt-2">
            {data?.summary.newsletter ?? 0}
          </p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500">Podcast</p>
          <p className="text-3xl font-black text-blue-600 mt-2">
            {data?.summary.podcast ?? 0}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email"
            className="md:max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              variant={filterType === "ALL" ? "default" : "outline"}
              onClick={() => setFilterType("ALL")}
            >
              All
            </Button>
            <Button
              variant={filterType === "NEWSLETTER" ? "default" : "outline"}
              onClick={() => setFilterType("NEWSLETTER")}
            >
              Newsletter
            </Button>
            <Button
              variant={filterType === "PODCAST" ? "default" : "outline"}
              onClick={() => setFilterType("PODCAST")}
            >
              Podcast
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500">Loading subscriptions...</p>
        ) : isError ? (
          <p className="text-sm text-red-600">Failed to load subscriptions.</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-500">No subscribers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2">Email</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Subscribed On</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="py-3 font-medium text-slate-900">
                      {item.email}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.type === "NEWSLETTER"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
