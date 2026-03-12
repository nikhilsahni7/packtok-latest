"use client";

import { Badge } from "@packtok/ui/badge";
import { Button } from "@packtok/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@packtok/ui/card";
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
import { ArrowLeft, Edit, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
    useAssignService,
    useDeleteService,
    useUpdateServiceStatus,
} from "../../../../hooks/useServices";
import {
    ServiceRequest,
    ServiceStatus,
    ServiceType,
} from "../../../../types/service";
import { AssignServiceDialog } from "./assign-service-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";

interface ServiceDetailViewProps {
  service: ServiceRequest;
}

const INTERNAL_SERVICE_KEYS = new Set(["id", "serviceRequestId"]);

const formatFieldLabel = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

const isLikelyUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://");

function SubmittedFields({
  data,
}: Readonly<{ data: Record<string, unknown> | null | undefined }>) {
  if (!data) return <p className="text-sm text-muted-foreground">No details.</p>;

  const entries = Object.entries(data).filter(
    ([key]) => !INTERNAL_SERVICE_KEYS.has(key)
  );

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No details.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-md border p-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {formatFieldLabel(key)}
          </p>
          {renderFieldValue(value)}
        </div>
      ))}
    </div>
  );
}

function renderFieldValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return <p className="text-sm">N/A</p>;
  }

  if (typeof value === "boolean") {
    return <p className="text-sm">{value ? "Yes" : "No"}</p>;
  }

  if (typeof value === "number") {
    return <p className="text-sm">{value}</p>;
  }

  if (typeof value === "string") {
    if (isLikelyUrl(value)) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(value, "_blank")}
          className="h-8"
        >
          Open Link
        </Button>
      );
    }
    const parsedDate = Date.parse(value);
    if (!Number.isNaN(parsedDate) && value.includes("T")) {
      return <p className="text-sm">{new Date(parsedDate).toLocaleString()}</p>;
    }
    return <p className="text-sm break-words">{value}</p>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm">N/A</p>;
    }

    if (value.every((item) => typeof item === "string" && isLikelyUrl(item))) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((url, index) => (
            <Button
              key={`${String(url)}-${index}`}
              variant="outline"
              size="sm"
              onClick={() => window.open(String(url), "_blank")}
              className="h-8"
            >
              File {index + 1}
            </Button>
          ))}
        </div>
      );
    }

    return <p className="text-sm break-words">{value.map(String).join(", ")}</p>;
  }

  return (
    <pre className="text-xs whitespace-pre-wrap break-words">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const router = useRouter();
  const [assigningService, setAssigningService] =
    useState<ServiceRequest | null>(null);
  const [updatingService, setUpdatingService] = useState<ServiceRequest | null>(
    null,
  );

  const updateStatusMutation = useUpdateServiceStatus();
  const assignServiceMutation = useAssignService();
  const deleteServiceMutation = useDeleteService();

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

  const handleDeleteService = async () => {
    try {
      await deleteServiceMutation.mutateAsync(service.id);
      toast.success("Service deleted successfully");
      router.push("/dashboard/services");
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const getServiceTitle = (): string => {
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
      [ServiceType.TURNKEY_PROJECT]: "Turnkey Project",
      [ServiceType.COMPANY_ACQUISITION]: "Company Acquisition",
      [ServiceType.MANPOWER_HIRING]: "Manpower Hiring",
      [ServiceType.JOB_SEEKER_SUBMISSION]: "Job Seeker",
      [ServiceType.MACHINERY_INSTALLER]: "Machinery Installer",
    };
    return <Badge variant="outline">{typeLabels[type]}</Badge>;
  };

  const renderServiceDetails = () => {
    switch (service.serviceType) {
      case ServiceType.MAINTENANCE:
        return <MaintenanceDetails service={service} />;
      case ServiceType.CONSULTANCY:
        return <ConsultancyDetails service={service} />;
      case ServiceType.TURNKEY_PROJECT:
        return <TurnkeyDetails service={service} />;
      case ServiceType.COMPANY_ACQUISITION:
        return <AcquisitionDetails service={service} />;
      case ServiceType.MANPOWER_HIRING:
        return <ManpowerDetails service={service} />;
      case ServiceType.JOB_SEEKER_SUBMISSION:
        return <JobSeekerDetails service={service} />;
      case ServiceType.MACHINERY_INSTALLER:
        return <MachineryInstallerDetails service={service} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/services")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{getServiceTitle()}</h1>
            <p className="text-muted-foreground">
              {getServiceTypeBadge(service.serviceType)} • Created{" "}
              {new Date(service.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setAssigningService(service)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Assign
          </Button>
          <Button
            variant="outline"
            onClick={() => setUpdatingService(service)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Update Status
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Service Request?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this service request? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteService}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteServiceMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status and Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(service.status)}
              <p className="text-sm text-muted-foreground">
                Last updated {new Date(service.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{service.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {service.user.email}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assigned To</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {service.assignedTo ? (
                <>
                  <p className="font-medium">{service.assignedTo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.assignedTo.email}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Unassigned</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>{renderServiceDetails()}</CardContent>
      </Card>

      {/* Activity Timeline */}
      {service.actionLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {service.actionLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {log.actor?.name || "System"} on{" "}
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                    {log.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
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
    </div>
  );
}

// Individual service detail components
function MaintenanceDetails({ service }: { service: ServiceRequest }) {
  const maintenance = service.maintenanceRequest;
  return (
    <SubmittedFields
      data={maintenance as unknown as Record<string, unknown>}
    />
  );
}

function ConsultancyDetails({ service }: { service: ServiceRequest }) {
  const consultancy = service.consultancyRequest;
  return (
    <SubmittedFields
      data={consultancy as unknown as Record<string, unknown>}
    />
  );
}

function TurnkeyDetails({ service }: { service: ServiceRequest }) {
  const turnkey = service.turnkeyProjectInquiry;
  return (
    <SubmittedFields data={turnkey as unknown as Record<string, unknown>} />
  );
}

function AcquisitionDetails({ service }: { service: ServiceRequest }) {
  const acquisition = service.companyAcquisitionInquiry;
  return (
    <SubmittedFields
      data={acquisition as unknown as Record<string, unknown>}
    />
  );
}

function ManpowerDetails({ service }: { service: ServiceRequest }) {
  const manpower = service.manpowerHiringRequest;
  return (
    <SubmittedFields data={manpower as unknown as Record<string, unknown>} />
  );
}

function JobSeekerDetails({ service }: { service: ServiceRequest }) {
  const jobSeeker = service.jobSeekerProfile;
  return (
    <SubmittedFields data={jobSeeker as unknown as Record<string, unknown>} />
  );
}

function MachineryInstallerDetails({
  service,
}: Readonly<{ service: ServiceRequest }>) {
  const installer = service.machineryInstallerRequest;
  return (
    <SubmittedFields data={installer as unknown as Record<string, unknown>} />
  );
}
