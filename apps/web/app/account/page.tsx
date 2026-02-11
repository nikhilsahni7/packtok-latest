"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ServiceRequest, useMyServiceRequests } from "@/hooks/useServiceSubmission";
import { Badge } from "@packtok/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@packtok/ui/components/card";
import { Input } from "@packtok/ui/components/input";
import { LayoutDashboard, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { data: services, isLoading: servicesLoading } = useMyServiceRequests();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) return null;

  const getServiceTypeDisplay = (serviceType: ServiceRequest['serviceType']) => {
    const serviceTypeMap = {
      MAINTENANCE: "Maintenance",
      CONSULTANCY: "Consultancy",
      TURNKEY_PROJECT: "Turnkey Project",
      COMPANY_ACQUISITION: "Company Acquisition",
      MANPOWER_HIRING: "Manpower Hiring",
      JOB_SEEKER: "Job Seeker"
    };
    return serviceTypeMap[serviceType] || serviceType;
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    const statusColors = {
      SUBMITTED: "bg-blue-100 text-blue-800",
      AWAITING_ASSIGNMENT: "bg-yellow-100 text-yellow-800",
      IN_REVIEW: "bg-purple-100 text-purple-800",
      ACTION_REQUIRED: "bg-orange-100 text-orange-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CLOSED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-8">
      {/* Vendor Dashboard Link */}
      {user.role === "VENDOR" && (
        <Link
          href="/vendor/dashboard"
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Vendor Dashboard</p>
            <p className="text-xs text-gray-500">Manage your products, orders & analytics</p>
          </div>
          <span className="text-orange-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
            Go to Dashboard &rarr;
          </span>
        </Link>
      )}

      {/* Account Details */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <div className="bg-white border rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
              <Input value={user.name?.split(" ")[0] || ""} readOnly className="bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
              <Input value={user.name?.split(" ").slice(1).join(" ") || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <Input value={user.email} readOnly className="bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <Input value={user.phone_number ?? "-"} readOnly className="bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
              <Input value={user.country ?? "-"} readOnly className="bg-gray-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Service Requests</h2>
        {servicesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {getServiceTypeDisplay(service.serviceType)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(service.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Service ID:</span>
                      <p className="text-muted-foreground font-mono text-xs">{service.id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <p className="text-muted-foreground">
                        {new Date(service.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t submitted any service requests yet.
              </p>
              <Link href="/services" className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Browse Services
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
