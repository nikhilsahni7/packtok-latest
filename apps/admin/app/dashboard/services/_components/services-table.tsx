"use client";

import { Badge } from "@packtok/ui/badge";
import { Button } from "@packtok/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@packtok/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@packtok/ui/components/alert-dialog";
import { Input } from "@packtok/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@packtok/ui/table";
import { Edit, Eye, Filter, Search, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    useAssignService,
    useDeleteService,
    useServices,
    useUpdateServiceStatus,
} from "../../../../hooks/useServices";
import {
    ServiceRequest,
    ServiceStatus,
    ServiceType,
} from "../../../../types/service";
import { AssignServiceDialog } from "./assign-service-dialog";
import { ServiceDetailsDialog } from "./service-details-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";

interface ServicesTableProps {
  initialServices?: ServiceRequest[];
}

export function ServicesTable({ initialServices = [] }: ServicesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(
    null,
  );
  const [assigningService, setAssigningService] =
    useState<ServiceRequest | null>(null);
  const [updatingService, setUpdatingService] = useState<ServiceRequest | null>(
    null,
  );

  const { data: services = initialServices, isLoading, error } = useServices();
  const updateStatusMutation = useUpdateServiceStatus();
  const assignServiceMutation = useAssignService();
  const deleteServiceMutation = useDeleteService();

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch service requests");
    }
  }, [error]);

  const handleStatusUpdate = async (
    serviceId: string,
    newStatus: ServiceStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: serviceId,
        status: newStatus,
      });
      toast.success("Service status updated successfully");
    } catch (error) {
      toast.error("Failed to update service status");
    }
  };

  const handleAssignService = async (serviceId: string, adminId: string) => {
    try {
      await assignServiceMutation.mutateAsync({ id: serviceId, adminId });
      toast.success("Service assigned successfully");
    } catch (error) {
      toast.error("Failed to assign service");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId);
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getServiceTitle(service).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;
    const matchesType =
      typeFilter === "all" || service.serviceType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getServiceTitle = (service: ServiceRequest): string => {
    switch (service.serviceType) {
      case ServiceType.MAINTENANCE:
        return service.maintenanceRequest?.companyName || "Maintenance Request";
      case ServiceType.CONSULTANCY:
        return service.consultancyRequest?.companyName || "Consultancy Request";
      case ServiceType.TURNKEY_PROJECT:
        return service.turnkeyProjectInquiry?.companyName || "Turnkey Project";
      case ServiceType.COMPANY_ACQUISITION:
        return (
          service.companyAcquisitionInquiry?.companyName ||
          "Company Acquisition"
        );
      case ServiceType.MANPOWER_HIRING:
        return service.manpowerHiringRequest?.companyName || "Manpower Hiring";
      case ServiceType.JOB_SEEKER_SUBMISSION:
        return (
          `${service.jobSeekerProfile?.firstName} ${service.jobSeekerProfile?.lastName}` ||
          "Job Seeker"
        );
      case ServiceType.MACHINERY_INSTALLER:
        return (
          service.machineryInstallerRequest?.companyName || "Machinery Installer"
        );
      default:
        return "Service Request";
    }
  };

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.SUBMITTED:
        return <Badge variant="secondary">Submitted</Badge>;
      case ServiceStatus.AWAITING_ASSIGNMENT:
        return <Badge variant="outline">Awaiting Assignment</Badge>;
      case ServiceStatus.IN_REVIEW:
        return <Badge variant="default">In Review</Badge>;
      case ServiceStatus.ACTION_REQUIRED:
        return <Badge variant="destructive">Action Required</Badge>;
      case ServiceStatus.APPROVED:
        return <Badge variant="default">Approved</Badge>;
      case ServiceStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      case ServiceStatus.IN_PROGRESS:
        return <Badge variant="default">In Progress</Badge>;
      case ServiceStatus.COMPLETED:
        return <Badge variant="default">Completed</Badge>;
      case ServiceStatus.CLOSED:
        return <Badge variant="outline">Closed</Badge>;
      case ServiceStatus.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceTypeBadge = (type: ServiceType) => {
    const typeLabels = {
      [ServiceType.MAINTENANCE]: "Maintenance",
      [ServiceType.CONSULTANCY]: "Consultancy",
      [ServiceType.TURNKEY_PROJECT]: "Turnkey",
      [ServiceType.COMPANY_ACQUISITION]: "Acquisition",
      [ServiceType.MANPOWER_HIRING]: "Manpower",
      [ServiceType.JOB_SEEKER_SUBMISSION]: "Job Seeker",
      [ServiceType.MACHINERY_INSTALLER]: "Machinery Installer",
    };
    return <Badge variant="outline">{typeLabels[type]}</Badge>;
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-200 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="h-10 flex-1 rounded-md bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-40 rounded-md bg-gray-200" />
              <div className="h-10 w-36 rounded-md bg-gray-200" />
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border-b">
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="h-6 w-20 rounded-full bg-gray-200" />
                <div className="h-6 w-24 rounded-full bg-gray-200" />
                <div className="h-8 w-32 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-8 w-32 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Requests</CardTitle>
        <CardDescription>
          Manage and track all service requests from customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value={ServiceStatus.SUBMITTED}>Submitted</option>
              <option value={ServiceStatus.AWAITING_ASSIGNMENT}>
                Awaiting Assignment
              </option>
              <option value={ServiceStatus.IN_REVIEW}>In Review</option>
              <option value={ServiceStatus.ACTION_REQUIRED}>
                Action Required
              </option>
              <option value={ServiceStatus.APPROVED}>Approved</option>
              <option value={ServiceStatus.REJECTED}>Rejected</option>
              <option value={ServiceStatus.IN_PROGRESS}>In Progress</option>
              <option value={ServiceStatus.COMPLETED}>Completed</option>
              <option value={ServiceStatus.CLOSED}>Closed</option>
              <option value={ServiceStatus.CANCELLED}>Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value={ServiceType.MAINTENANCE}>Maintenance</option>
              <option value={ServiceType.CONSULTANCY}>Consultancy</option>
              <option value={ServiceType.TURNKEY_PROJECT}>
                Turnkey Project
              </option>
              <option value={ServiceType.COMPANY_ACQUISITION}>
                Company Acquisition
              </option>
              <option value={ServiceType.MANPOWER_HIRING}>
                Manpower Hiring
              </option>
              <option value={ServiceType.JOB_SEEKER_SUBMISSION}>
                Job Seeker
              </option>
              <option value={ServiceType.MACHINERY_INSTALLER}>
                Machinery Installer
              </option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  {getServiceTitle(service)}
                </TableCell>
                <TableCell>
                  {getServiceTypeBadge(service.serviceType)}
                </TableCell>
                <TableCell>{getStatusBadge(service.status)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{service.user?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.user?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {service.assignedTo ? (
                    <div className="font-medium">{service.assignedTo.name}</div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(service.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedService(service)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAssigningService(service)}
                      title="Assign to Admin"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUpdatingService(service)}
                      title="Update Status"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          title="Delete Service"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Service Request?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this service
                            request? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteService(service.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deleteServiceMutation.isPending
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "No services found matching your criteria."
                : "No service requests yet."}
            </p>
          </div>
        )}
      </CardContent>

      <ServiceDetailsDialog
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onStatusUpdate={handleStatusUpdate}
        getStatusBadge={getStatusBadge}
        getServiceTypeBadge={getServiceTypeBadge}
      />

      <AssignServiceDialog
        service={assigningService}
        onClose={() => setAssigningService(null)}
        onAssign={handleAssignService}
      />

      <UpdateStatusDialog
        service={updatingService}
        onClose={() => setUpdatingService(null)}
        onStatusUpdate={handleStatusUpdate}
        getStatusBadge={getStatusBadge}
      />
    </Card>
  );
}
