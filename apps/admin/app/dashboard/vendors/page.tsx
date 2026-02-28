"use client";

import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Check, Loader2, RefreshCw, Search, X } from "lucide-react";
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
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["admin", "vendor-applications"] });
    setRefreshing(false);
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    reject.mutate(
      { id: rejectTarget.id, reason: rejectReason || undefined },
      {
        onSuccess: () => {
          setRejectTarget(null);
          setRejectReason("");
        },
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vendor Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {apps.length} total · {apps.filter(a => a.status === "PENDING").length} pending
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
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
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider border-b bg-gray-50">
                <th className="text-left px-4 py-3 w-[22%]">Vendor</th>
                <th className="text-left px-4 py-3 w-[13%]">Contact</th>
                <th className="text-left px-4 py-3 w-[15%]">Company</th>
                <th className="text-left px-4 py-3 w-[25%]">Vendor Notes</th>
                <th className="text-left px-4 py-3 w-[10%]">Status</th>
                <th className="text-right px-4 py-3 w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {app.user.name || "—"}
                    </p>
                    <p className="text-xs text-blue-600 truncate">{app.user.email}</p>
                    <p className="text-xs text-gray-400">
                      {app.user.country || ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900 whitespace-nowrap">
                      {app.user.phone_number || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">
                      {app.companyName || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {app.notes || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        app.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : app.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {app.status === "APPROVED" && <Check className="h-3 w-3" />}
                      {app.status === "REJECTED" && <X className="h-3 w-3" />}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={approve.isPending || app.status === "APPROVED"}
                        onClick={() => approve.mutate(app.id)}
                        className="text-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={reject.isPending || app.status === "REJECTED"}
                        onClick={() => setRejectTarget({ id: app.id, name: app.user.name || app.user.email })}
                        className="text-xs"
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No vendor applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Vendor Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setRejectTarget(null); setRejectReason(""); }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reject Vendor Application
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Rejecting application from
              </p>
              <p className="text-sm font-semibold text-gray-900 mb-4">
                {rejectTarget.name}
              </p>

              <div className="w-full text-left mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide a reason for rejection (will be shown to the vendor)..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleReject}
                  disabled={reject.isPending}
                >
                  {reject.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
