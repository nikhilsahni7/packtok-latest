"use client";

import { Badge } from "@packtok/ui/badge";
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
import { Clock, Download, User } from "lucide-react";
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
      default:
        return null;
    }
  };

  const renderMaintenanceDetails = () => {
    const maintenance = service.maintenanceRequest;
    if (!maintenance) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Maintenance Type
            </label>
            <p className="text-sm">{maintenance.maintenanceType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Company</label>
            <p className="text-sm">{maintenance.companyName}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Address</label>
          <p className="text-sm">{maintenance.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Machine Name
            </label>
            <p className="text-sm">{maintenance.machineName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Serial Number
            </label>
            <p className="text-sm">{maintenance.machineIdOrSerialNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Location
            </label>
            <p className="text-sm">{maintenance.locationInFacility}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Manufacturer
            </label>
            <p className="text-sm">{maintenance.manufacturer || "N/A"}</p>
          </div>
        </div>

        {maintenance.installationDate && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Installation Date
            </label>
            <p className="text-sm">
              {new Date(maintenance.installationDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {maintenance.technicianNotes && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Technician Notes
            </label>
            <p className="text-sm">{maintenance.technicianNotes}</p>
          </div>
        )}

        {maintenance.supervisorApprovalName && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Supervisor
            </label>
            <p className="text-sm">{maintenance.supervisorApprovalName}</p>
          </div>
        )}
      </div>
    );
  };

  const renderConsultancyDetails = () => {
    const consultancy = service.consultancyRequest;
    if (!consultancy) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Company</label>
            <p className="text-sm">{consultancy.companyName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Contact Person
            </label>
            <p className="text-sm">{consultancy.contactPerson}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Designation
            </label>
            <p className="text-sm">{consultancy.designation}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Industry
            </label>
            <p className="text-sm">{consultancy.industryType}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-sm">{consultancy.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm">{consultancy.email}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Address</label>
          <p className="text-sm">{consultancy.companyAddress}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Services Required
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {consultancy.servicesRequired.map((service, index) => (
              <Badge key={index} variant="secondary">
                {service.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Project Goals
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {consultancy.projectGoals.map((goal, index) => (
              <Badge key={index} variant="outline">
                {goal.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Current Challenges
          </label>
          <p className="text-sm">{consultancy.currentChallenges}</p>
        </div>

        {consultancy.estimatedBudget && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Estimated Budget
            </label>
            <p className="text-sm">{consultancy.estimatedBudget}</p>
          </div>
        )}
      </div>
    );
  };

  const renderTurnkeyDetails = () => {
    const turnkey = service.turnkeyProjectInquiry;
    if (!turnkey) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Company</label>
            <p className="text-sm">{turnkey.companyName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Contact</label>
            <p className="text-sm">{turnkey.contactName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="text-sm">{turnkey.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm">{turnkey.email}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Industries
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {turnkey.industry.map((ind, index) => (
              <Badge key={index} variant="secondary">
                {ind.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Facility Type
          </label>
          <p className="text-sm">{turnkey.facilityType.replace(/_/g, " ")}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Project Description
          </label>
          <p className="text-sm">{turnkey.projectDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Production Capacity
            </label>
            <p className="text-sm">{turnkey.targetProductionCapacity}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Timeline
            </label>
            <p className="text-sm">
              {turnkey.completionTimeline.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Services Needed
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {turnkey.servicesNeeded.map((service, index) => (
              <Badge key={index} variant="outline">
                {service.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Budget</label>
            <p className="text-sm">
              {turnkey.estimatedBudget.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Funding Status
            </label>
            <p className="text-sm">
              {turnkey.fundingStatus.replace(/_/g, " ")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAcquisitionDetails = () => {
    const acquisition = service.companyAcquisitionInquiry;
    if (!acquisition) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Company</label>
            <p className="text-sm">{acquisition.companyName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Contact</label>
            <p className="text-sm">{acquisition.contactName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="text-sm">{acquisition.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Inquirer Type
            </label>
            <p className="text-sm">{acquisition.inquirerType}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Transaction Type
            </label>
            <p className="text-sm">
              {acquisition.transactionType.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Legal Structure
            </label>
            <p className="text-sm">
              {acquisition.sellerLegalStructure?.replace(/_/g, " ") || "N/A"}
            </p>
          </div>
        </div>

        {acquisition.intendedOutcome && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Intended Outcome
            </label>
            <p className="text-sm">{acquisition.intendedOutcome}</p>
          </div>
        )}

        {acquisition.sellerAnnualRevenue && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Annual Revenue
              </label>
              <p className="text-sm">{acquisition.sellerAnnualRevenue}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                EBITDA
              </label>
              <p className="text-sm">{acquisition.sellerEbitda || "N/A"}</p>
            </div>
          </div>
        )}

        {acquisition.advisorsEngaged.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Advisors Engaged
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {acquisition.advisorsEngaged.map((advisor, index) => (
                <Badge key={index} variant="secondary">
                  {advisor}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderManpowerDetails = () => {
    const manpower = service.manpowerHiringRequest;
    if (!manpower) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Company</label>
            <p className="text-sm">{manpower.companyName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Contact Person
            </label>
            <p className="text-sm">{manpower.contactPerson}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Industry
            </label>
            <p className="text-sm">{manpower.industryType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Urgency</label>
            <p className="text-sm">{manpower.hiringUrgency}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Manpower Types
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {manpower.manpowerType.map((type, index) => (
              <Badge key={index} variant="secondary">
                {type.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Skilled Workers
            </label>
            <p className="text-sm">{manpower.skilledWorkersRequired}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Semi-skilled
            </label>
            <p className="text-sm">{manpower.semiSkilledWorkersRequired}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Unskilled
            </label>
            <p className="text-sm">{manpower.unskilledWorkersRequired}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Work Location
          </label>
          <p className="text-sm">{manpower.workLocation}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Expected Joining Date
          </label>
          <p className="text-sm">
            {new Date(manpower.expectedJoiningDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  const renderJobSeekerDetails = () => {
    const jobSeeker = service.jobSeekerProfile;
    if (!jobSeeker) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-sm">
              {jobSeeker.firstName} {jobSeeker.lastName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-sm">{jobSeeker.phone}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Address</label>
          <p className="text-sm">
            {jobSeeker.address}, {jobSeeker.city}, {jobSeeker.state}{" "}
            {jobSeeker.postalCode}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Position Sought
            </label>
            <p className="text-sm">{jobSeeker.positionSought}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Working Mode
            </label>
            <p className="text-sm">{jobSeeker.preferredWorkingMode}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Previously Worked With Us
          </label>
          <p className="text-sm">
            {jobSeeker.hasPreviouslyWorkedWithUs ? "Yes" : "No"}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">CV</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(jobSeeker.cvUrl, "_blank")}
          >
            <Download className="h-4 w-4 mr-2" />
            Download CV
          </Button>
        </div>
      </div>
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
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div className="mt-1">{getStatusBadge(service.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Service ID
                  </label>
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
                    <label className="text-sm font-medium text-gray-500">
                      Assigned To
                    </label>
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
