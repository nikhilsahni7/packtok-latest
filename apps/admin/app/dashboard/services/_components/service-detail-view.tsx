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
import { ArrowLeft, Download, Edit, Trash2, UserPlus } from "lucide-react";
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
  if (!maintenance) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-medium mb-3">Company Information</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Company:</strong> {maintenance.companyName}
          </div>
          <div>
            <strong>Address:</strong> {maintenance.address}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Machine Details</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Machine:</strong> {maintenance.machineName}
          </div>
          <div>
            <strong>Serial Number:</strong>{" "}
            {maintenance.machineIdOrSerialNumber}
          </div>
          <div>
            <strong>Location:</strong> {maintenance.locationInFacility}
          </div>
          <div>
            <strong>Manufacturer:</strong> {maintenance.manufacturer || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultancyDetails({ service }: { service: ServiceRequest }) {
  const consultancy = service.consultancyRequest;
  if (!consultancy) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">Company Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Company:</strong> {consultancy.companyName}
            </div>
            <div>
              <strong>Contact:</strong> {consultancy.contactPerson}
            </div>
            <div>
              <strong>Email:</strong> {consultancy.email}
            </div>
            <div>
              <strong>Phone:</strong> {consultancy.phone}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Industry Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Industry:</strong> {consultancy.industryType}
            </div>
            <div>
              <strong>Years in Operation:</strong>{" "}
              {consultancy.yearsInOperation || "N/A"}
            </div>
            <div>
              <strong>Employees:</strong>{" "}
              {consultancy.employeesOperatingMachines || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Services Required</h3>
        <div className="flex flex-wrap gap-2">
          {consultancy.servicesRequired.map((service, index) => (
            <Badge key={index} variant="secondary">
              {service.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function TurnkeyDetails({ service }: { service: ServiceRequest }) {
  const turnkey = service.turnkeyProjectInquiry;
  if (!turnkey) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Company:</strong> {turnkey.companyName}
            </div>
            <div>
              <strong>Contact:</strong> {turnkey.contactName}
            </div>
            <div>
              <strong>Email:</strong> {turnkey.email}
            </div>
            <div>
              <strong>Phone:</strong> {turnkey.phone}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Project Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Facility Type:</strong>{" "}
              {turnkey.facilityType.replace(/_/g, " ")}
            </div>
            <div>
              <strong>Timeline:</strong>{" "}
              {turnkey.completionTimeline.replace(/_/g, " ")}
            </div>
            <div>
              <strong>Budget:</strong>{" "}
              {turnkey.estimatedBudget.replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Project Description</h3>
        <p className="text-sm">{turnkey.projectDescription}</p>
      </div>
    </div>
  );
}

function AcquisitionDetails({ service }: { service: ServiceRequest }) {
  const acquisition = service.companyAcquisitionInquiry;
  if (!acquisition) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Company:</strong> {acquisition.companyName}
            </div>
            <div>
              <strong>Contact:</strong> {acquisition.contactName}
            </div>
            <div>
              <strong>Email:</strong> {acquisition.email}
            </div>
            <div>
              <strong>Phone:</strong> {acquisition.phone}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Inquirer Type:</strong> {acquisition.inquirerType}
            </div>
            <div>
              <strong>Transaction Type:</strong>{" "}
              {acquisition.transactionType.replace(/_/g, " ")}
            </div>
            <div>
              <strong>Legal Structure:</strong>{" "}
              {acquisition.sellerLegalStructure?.replace(/_/g, " ") || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {acquisition.intendedOutcome && (
        <div>
          <h3 className="font-medium mb-3">Intended Outcome</h3>
          <p className="text-sm">{acquisition.intendedOutcome}</p>
        </div>
      )}
    </div>
  );
}

function ManpowerDetails({ service }: { service: ServiceRequest }) {
  const manpower = service.manpowerHiringRequest;
  if (!manpower) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">Company Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Company:</strong> {manpower.companyName}
            </div>
            <div>
              <strong>Contact:</strong> {manpower.contactPerson}
            </div>
            <div>
              <strong>Email:</strong> {manpower.email}
            </div>
            <div>
              <strong>Phone:</strong> {manpower.phone}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Requirements</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Skilled Workers:</strong>{" "}
              {manpower.skilledWorkersRequired}
            </div>
            <div>
              <strong>Semi-skilled:</strong>{" "}
              {manpower.semiSkilledWorkersRequired}
            </div>
            <div>
              <strong>Unskilled:</strong> {manpower.unskilledWorkersRequired}
            </div>
            <div>
              <strong>Urgency:</strong> {manpower.hiringUrgency}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Manpower Types</h3>
        <div className="flex flex-wrap gap-2">
          {manpower.manpowerType.map((type, index) => (
            <Badge key={index} variant="secondary">
              {type.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function JobSeekerDetails({ service }: { service: ServiceRequest }) {
  const jobSeeker = service.jobSeekerProfile;
  if (!jobSeeker) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">Personal Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Name:</strong> {jobSeeker.firstName} {jobSeeker.lastName}
            </div>
            <div>
              <strong>Phone:</strong> {jobSeeker.phone}
            </div>
            <div>
              <strong>Address:</strong> {jobSeeker.address}, {jobSeeker.city},{" "}
              {jobSeeker.state} {jobSeeker.postalCode}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Job Preferences</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Position Sought:</strong> {jobSeeker.positionSought}
            </div>
            <div>
              <strong>Working Mode:</strong> {jobSeeker.preferredWorkingMode}
            </div>
            <div>
              <strong>Previously Worked:</strong>{" "}
              {jobSeeker.hasPreviouslyWorkedWithUs ? "Yes" : "No"}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Resume</h3>
        <Button
          variant="outline"
          onClick={() => window.open(jobSeeker.cvUrl, "_blank")}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download CV
        </Button>
      </div>
    </div>
  );
}
