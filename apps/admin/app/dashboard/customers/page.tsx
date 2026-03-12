"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@packtok/ui/components/alert-dialog";
import { Button } from "@packtok/ui/components/button";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { productTabs } from "../../../constants/navigation";
import {
    AdminUser,
    useAdminUser,
    useAdminUsers,
    useDeleteUser,
} from "../../../hooks/useUsers";
import { QK } from "../../../utils/queryKeys";
import { CustomerSidebar } from "./_components/customer-sidebar";
import { CustomersTable } from "./_components/customers-table";
import { EditCustomerDialog } from "./_components/edit-customer-dialog";

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const { data: customers = [], isLoading, isError } = useAdminUsers();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: userDetail, isLoading: isDetailLoading } =
    useAdminUser(selectedUserId);

  const [editingCustomer, setEditingCustomer] = useState<AdminUser | null>(
    null
  );
  const [deletingCustomer, setDeletingCustomer] = useState<AdminUser | null>(
    null
  );
  const deleteUser = useDeleteUser();

  const handleEdit = (customer: AdminUser) => {
    setEditingCustomer(customer);
  };

  const handleDelete = (customer: AdminUser) => {
    setDeletingCustomer(customer);
  };

  const confirmDelete = async () => {
    if (!deletingCustomer) return;
    await deleteUser.mutateAsync(deletingCustomer.id);
    if (selectedUserId === deletingCustomer.id) {
      setSelectedUserId(null);
    }
    setDeletingCustomer(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: QK.customers });
    setRefreshing(false);
  };

  if (isError) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center space-y-4 bg-red-50/30 p-8 rounded-3xl border border-red-100">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Activity className="text-red-600 w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              Failed to load customers
            </h3>
            <p className="text-sm text-slate-600">
              There was an error communicating with the server. Please try
              again.
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-red-200"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
            Users
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Manage entries, roles and access permissions for all users.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-xl gap-2 bg-white"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
            {productTabs.map((tab) => (
              <Link key={tab.value} href={tab.href}>
                <Button
                  variant={tab.value === "customers" ? "default" : "ghost"}
                  className={
                    tab.value === "customers"
                      ? "bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl px-6"
                  }
                >
                  {tab.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer List */}
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-full bg-slate-200 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <CustomersTable
              customers={customers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={(user) => setSelectedUserId(user.id)}
              selectedId={selectedUserId || undefined}
            />
          )}
        </div>

        {/* Customer Detail Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right-2 duration-500">
          <CustomerSidebar
            customer={userDetail || null}
            isLoading={isDetailLoading}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <EditCustomerDialog
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCustomer}
        onOpenChange={() => setDeletingCustomer(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete User Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                You are about to permanently delete{" "}
                <strong>{deletingCustomer?.name}</strong> (
                {deletingCustomer?.email}).
              </span>
              <span className="block text-red-600 font-medium">
                This will also remove all their orders, cart, addresses,
                bookmarks, reviews, auction bids, service requests, and all
                other related data. This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUser.isPending ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
