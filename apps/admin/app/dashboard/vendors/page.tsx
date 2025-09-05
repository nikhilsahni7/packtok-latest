"use client";

import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { Check, Loader2, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  useApproveVendor,
  useRejectVendor,
  useVendorApplications,
} from "../../../hooks/useVendors";

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useVendorApplications();
  const approve = useApproveVendor();
  const reject = useRejectVendor();

  const apps = useMemo(() => data?.data ?? [], [data]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apps.filter((a) =>
      [a.user.name ?? "", a.user.email, a.companyName ?? "", a.notes ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [apps, search]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
        <div className="relative w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, company or notes"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading vendor
          applications...
        </div>
      )}
      {isError && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3">
          Failed to load vendor applications.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-lg border">
          <div className="grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 border-b">
            <div className="col-span-3">Vendor</div>
            <div className="col-span-2">Contact</div>
            <div className="col-span-2">Company</div>
            <div className="col-span-3">Notes</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <ul className="divide-y">
            {filtered.map((app) => (
              <li
                key={app.id}
                className="grid grid-cols-12 items-center px-6 py-4"
              >
                <div className="col-span-3">
                  <p className="text-sm font-medium text-gray-900">
                    {app.user.name || "—"}
                  </p>
                  <p className="text-xs text-gray-500">{app.user.email}</p>
                  <p className="text-xs text-gray-400">
                    {app.user.country || ""}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-900">
                    {app.user.phone_number || "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-900">
                    {app.companyName || "—"}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {app.notes || "—"}
                  </p>
                </div>
                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      app.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : app.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={approve.isPending || app.status === "APPROVED"}
                    onClick={() => approve.mutate(app.id)}
                  >
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={reject.isPending || app.status === "REJECTED"}
                    onClick={() => reject.mutate({ id: app.id })}
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </li>
            ))}

            {filtered.length === 0 && (
              <li className="px-6 py-8 text-center text-gray-500">
                No vendor applications found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
