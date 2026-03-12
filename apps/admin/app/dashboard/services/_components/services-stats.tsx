"use client";

import { ServiceStatus, ServiceType } from "../../../../types/service";
import { Card, CardContent, CardHeader, CardTitle } from "@packtok/ui/card";
import {
  Settings,
  Users,
  Building,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { useServices } from "../../../../hooks/useServices";

export function ServicesStats() {
  const { data: services = [] } = useServices();

  const totalServices = services.length;
  const pendingServices = services.filter(
    (s) =>
      s.status === ServiceStatus.SUBMITTED ||
      s.status === ServiceStatus.AWAITING_ASSIGNMENT,
  ).length;
  const inReviewServices = services.filter(
    (s) =>
      s.status === ServiceStatus.IN_REVIEW ||
      s.status === ServiceStatus.ACTION_REQUIRED ||
      s.status === ServiceStatus.IN_PROGRESS,
  ).length;
  const completedServices = services.filter(
    (s) =>
      s.status === ServiceStatus.COMPLETED ||
      s.status === ServiceStatus.APPROVED ||
      s.status === ServiceStatus.CLOSED,
  ).length;

  const servicesByType = services.reduce(
    (acc, service) => {
      acc[service.serviceType] = (acc[service.serviceType] || 0) + 1;
      return acc;
    },
    {} as Record<ServiceType, number>,
  );

  const getServiceTypeIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.MAINTENANCE:
        return <Settings className="h-4 w-4" />;
      case ServiceType.CONSULTANCY:
        return <Users className="h-4 w-4" />;
      case ServiceType.TURNKEY_PROJECT:
        return <Building className="h-4 w-4" />;
      case ServiceType.COMPANY_ACQUISITION:
        return <Briefcase className="h-4 w-4" />;
      case ServiceType.MANPOWER_HIRING:
        return <Users className="h-4 w-4" />;
      case ServiceType.JOB_SEEKER_SUBMISSION:
        return <Users className="h-4 w-4" />;
      case ServiceType.MACHINERY_INSTALLER:
        return <Wrench className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getServiceTypeLabel = (type: ServiceType) => {
    switch (type) {
      case ServiceType.MAINTENANCE:
        return "Maintenance";
      case ServiceType.CONSULTANCY:
        return "Consultancy";
      case ServiceType.TURNKEY_PROJECT:
        return "Turnkey Project";
      case ServiceType.COMPANY_ACQUISITION:
        return "Company Acquisition";
      case ServiceType.MANPOWER_HIRING:
        return "Manpower Hiring";
      case ServiceType.JOB_SEEKER_SUBMISSION:
        return "Job Seeker";
      case ServiceType.MACHINERY_INSTALLER:
        return "Machinery Installer";
      default:
        return String(type).replace(/_/g, " ");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServices}</div>
          <p className="text-xs text-muted-foreground">All service requests</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingServices}</div>
          <p className="text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Review</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inReviewServices}</div>
          <p className="text-xs text-muted-foreground">Being processed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedServices}</div>
          <p className="text-xs text-muted-foreground">Successfully finished</p>
        </CardContent>
      </Card>

      {/* Service Types Overview */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Service Types Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(servicesByType).map(([type, count]) => (
              <div key={type} className="flex items-center space-x-2">
                {getServiceTypeIcon(type as ServiceType)}
                <div>
                  <p className="text-sm font-medium">
                    {getServiceTypeLabel(type as ServiceType)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {count} requests
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
