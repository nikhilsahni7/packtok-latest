"use client";

import { Button } from "@packtok/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@packtok/ui/dialog";
import { ScrollArea } from "@packtok/ui/scroll-area";
import { Separator } from "@packtok/ui/separator";
import { Clock, User } from "lucide-react";
import React from "react";
import {
    ServiceRequest,
    ServiceStatus,
    ServiceType,
} from "../../../../types/service";

interface ServiceDetailsDialogProps {
  service: ServiceRequest | null;
  onClose: () => void;
  onStatusUpdate: (serviceId: string, status: ServiceStatus) => void;
  getStatusBadge: (status: ServiceStatus) => React.ReactNode;
  getServiceTypeBadge: (type: ServiceType) => React.ReactNode;
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
          <p className="text-xs font-medium text-gray-500">{formatFieldLabel(key)}</p>
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

export function ServiceDetailsDialog({
  service,
  onClose,
  onStatusUpdate: _onStatusUpdate,
  getStatusBadge,
  getServiceTypeBadge,
}: ServiceDetailsDialogProps) {
  if (!service) return null;

  const renderServiceSpecificDetails = () => {
    switch (service.serviceType) {
      case ServiceType.MAINTENANCE:
        return renderMaintenanceDetails();
      case ServiceType.CONSULTANCY:
        return renderConsultancyDetails();
      case ServiceType.TURNKEY_PROJECT:
        return renderTurnkeyDetails();
      case ServiceType.COMPANY_ACQUISITION:
        return renderAcquisitionDetails();
      case ServiceType.MANPOWER_HIRING:
        return renderManpowerDetails();
      case ServiceType.JOB_SEEKER_SUBMISSION:
        return renderJobSeekerDetails();
      case ServiceType.MACHINERY_INSTALLER:
        return renderMachineryInstallerDetails();
      default:
        return null;
    }
  };

  const renderMaintenanceDetails = () => {
    const maintenance = service.maintenanceRequest;
    return (
      <SubmittedFields
        data={maintenance as unknown as Record<string, unknown>}
      />
    );
  };

  const renderConsultancyDetails = () => {
    const consultancy = service.consultancyRequest;
    return (
      <SubmittedFields
        data={consultancy as unknown as Record<string, unknown>}
      />
    );
  };

  const renderTurnkeyDetails = () => {
    const turnkey = service.turnkeyProjectInquiry;
    return (
      <SubmittedFields data={turnkey as unknown as Record<string, unknown>} />
    );
  };

  const renderAcquisitionDetails = () => {
    const acquisition = service.companyAcquisitionInquiry;
    return (
      <SubmittedFields
        data={acquisition as unknown as Record<string, unknown>}
      />
    );
  };

  const renderManpowerDetails = () => {
    const manpower = service.manpowerHiringRequest;
    return (
      <SubmittedFields data={manpower as unknown as Record<string, unknown>} />
    );
  };

  const renderJobSeekerDetails = () => {
    const jobSeeker = service.jobSeekerProfile;
    return (
      <SubmittedFields data={jobSeeker as unknown as Record<string, unknown>} />
    );
  };

  const renderMachineryInstallerDetails = () => {
    const installer = service.machineryInstallerRequest;
    return (
      <SubmittedFields data={installer as unknown as Record<string, unknown>} />
    );
  };

  return (
    <Dialog open={!!service} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Service Request Details
            {getServiceTypeBadge(service.serviceType)}
          </DialogTitle>
          <DialogDescription>
            Created on {new Date(service.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Status and Basic Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(service.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Service ID</p>
                  <p className="text-sm font-mono">{service.id}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="font-medium mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{service.user.name}</p>
                    <p className="text-xs text-gray-500">
                      {service.user.email}
                    </p>
                  </div>
                </div>
                {service.assignedTo && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assigned To</p>
                    <p className="text-sm">{service.assignedTo.name}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Service-specific Details */}
            <div>
              <h3 className="font-medium mb-3">Service Details</h3>
              {renderServiceSpecificDetails()}
            </div>

            {/* Action Logs */}
            {service.actionLogs.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-3">Activity Timeline</h3>
                  <div className="space-y-3">
                    {service.actionLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-gray-500">
                            by {log.actor?.name || "System"} on{" "}
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                          {log.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              {log.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
