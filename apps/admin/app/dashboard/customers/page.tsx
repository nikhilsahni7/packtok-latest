"use client";

import { Button } from "@packtok/ui/components/button";
import { Activity } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { productTabs } from "../../../constants/navigation";
import { useAdminUser, useAdminUsers } from "../../../hooks/useUsers";
import { CustomerSidebar } from "./_components/customer-sidebar";
import { CustomersTable } from "./_components/customers-table";

export default function CustomersPage() {
  const { data: customers = [], isLoading, isError } = useAdminUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: userDetail, isLoading: isDetailLoading } = useAdminUser(selectedUserId);

  const handleEdit = (customer: any) => {
    console.log("Edit customer:", customer);
  };

  const handleDelete = (customer: any) => {
    console.log("Delete customer:", customer);
  };

  if (isError) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center space-y-4 bg-red-50/30 p-8 rounded-3xl border border-red-100">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Activity className="text-red-600 w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Failed to load customers</h3>
            <p className="text-sm text-slate-600">There was an error communicating with the server. Please try again.</p>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-red-200">
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
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">Users</h1>
          <p className="text-slate-500 font-medium text-sm">Manage entries, roles and access permissions for all users.</p>
        </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer List */}
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           {isLoading ? (
             <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 w-full bg-slate-200 animate-pulse rounded-2xl" />
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
    </div>
  );
}
