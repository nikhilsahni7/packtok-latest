"use client";

import api from "@/lib/axios";
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Clock,
    Loader2,
    Send,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Types
type ServiceType =
  | "MAINTENANCE"
  | "CONSULTANCY"
  | "TURNKEY_PROJECT"
  | "COMPANY_ACQUISITION"
  | "MANPOWER_HIRING"
  | "JOB_SEEKER_SUBMISSION";

type ServiceStatus =
  | "SUBMITTED"
  | "AWAITING_ASSIGNMENT"
  | "IN_REVIEW"
  | "ACTION_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELLED";

interface ActionLog {
  id: string;
  createdAt: string;
  action: string;
  notes: string | null;
}

interface ServiceRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  serviceType: ServiceType;
  status: ServiceStatus;
  actionLogs: ActionLog[];
  maintenanceRequest: Record<string, unknown> | null;
  consultancyRequest: Record<string, unknown> | null;
  turnkeyProjectInquiry: Record<string, unknown> | null;
  companyAcquisitionInquiry: Record<string, unknown> | null;
  manpowerHiringRequest: Record<string, unknown> | null;
  jobSeekerProfile: Record<string, unknown> | null;
}

// Service type display names
const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  MAINTENANCE: "Maintenance",
  CONSULTANCY: "Consultancy",
  TURNKEY_PROJECT: "Turnkey",
  COMPANY_ACQUISITION: "Company Acquisition",
  MANPOWER_HIRING: "Manpower Hiring",
  JOB_SEEKER_SUBMISSION: "Job Seeker",
};

// Status config
const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; color: string; bgColor: string }
> = {
  SUBMITTED: { label: "Submitted", color: "text-blue-700", bgColor: "bg-blue-100" },
  AWAITING_ASSIGNMENT: { label: "Awaiting Assignment", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  IN_REVIEW: { label: "In Review", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  ACTION_REQUIRED: { label: "Action Required", color: "text-orange-700", bgColor: "bg-orange-100" },
  APPROVED: { label: "Approved", color: "text-green-700", bgColor: "bg-green-100" },
  REJECTED: { label: "Rejected", color: "text-red-700", bgColor: "bg-red-100" },
  IN_PROGRESS: { label: "In Progress", color: "text-purple-700", bgColor: "bg-purple-100" },
  COMPLETED: { label: "Completed", color: "text-green-700", bgColor: "bg-green-100" },
  CLOSED: { label: "Closed", color: "text-gray-700", bgColor: "bg-gray-100" },
  CANCELLED: { label: "Cancelled", color: "text-gray-500", bgColor: "bg-gray-100" },
};

// Determine the active step (1-3) from status
function getStepFromStatus(status: ServiceStatus): {
  step: number;
  isRejected: boolean;
  isCancelled: boolean;
} {
  switch (status) {
    case "SUBMITTED":
    case "AWAITING_ASSIGNMENT":
      return { step: 1, isRejected: false, isCancelled: false };
    case "IN_REVIEW":
    case "ACTION_REQUIRED":
      return { step: 2, isRejected: false, isCancelled: false };
    case "APPROVED":
    case "IN_PROGRESS":
    case "COMPLETED":
    case "CLOSED":
      return { step: 3, isRejected: false, isCancelled: false };
    case "REJECTED":
      return { step: 3, isRejected: true, isCancelled: false };
    case "CANCELLED":
      return { step: 0, isRejected: false, isCancelled: true };
  }
}

// Get the form details from the sub-model
function getFormDetails(request: ServiceRequest): Record<string, unknown> | null {
  return (
    request.maintenanceRequest ||
    request.consultancyRequest ||
    request.turnkeyProjectInquiry ||
    request.companyAcquisitionInquiry ||
    request.manpowerHiringRequest ||
    request.jobSeekerProfile
  );
}

// Format field name for display
function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/Id$/, "ID")
    .replace(/Url$/, "URL");
}

// Format field value for display
function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Array) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  const strVal = String(value);
  // Try to detect date strings
  if (/^\d{4}-\d{2}-\d{2}/.test(strVal)) {
    try {
      return new Date(strVal).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return strVal;
    }
  }
  return strVal;
}

// Step indicator component
function StepIndicator({
  step,
  isRejected,
  isCancelled,
}: {
  step: number;
  isRejected: boolean;
  isCancelled: boolean;
}) {
  const steps = [
    { num: 1, label: "Information Submitted", desc: "Tell us who you are to get started." },
    { num: 2, label: "Identity Verification", desc: "Verify your identity for security purposes." },
    { num: 3, label: "Approved by Packtok", desc: "Final step! Let's activate your account." },
  ];

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
        <XCircle className="h-4 w-4" />
        <span>This request has been cancelled</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-0 mt-4">
      {steps.map((s, i) => {
        const isActive = s.num === step;
        const isCompleted = s.num < step;
        const isRej = isRejected && s.num === 3;

        return (
          <div key={s.num} className="flex items-start flex-1">
            {/* Step */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Line before (except first) */}
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isCompleted || isActive
                        ? isRej
                          ? "bg-red-400"
                          : "bg-orange-400"
                        : "bg-gray-200"
                    }`}
                  />
                )}

                {/* Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isRej
                      ? "bg-red-500 text-white"
                      : isCompleted
                      ? "bg-orange-500 text-white"
                      : isActive
                      ? "bg-orange-500 text-white ring-4 ring-orange-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isRej ? (
                    <XCircle className="h-3.5 w-3.5" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    s.num
                  )}
                </div>

                {/* Line after (except last) */}
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isCompleted ? "bg-orange-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center px-1">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    isRej
                      ? "text-red-600"
                      : isActive || isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {isRej ? "Rejected" : s.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block leading-tight">
                  {s.desc}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FormTrackingPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get<{ data: ServiceRequest[] }>(
        "/api/v1/services/my"
      );
      setRequests(res.data.data || []);
    } catch {
      toast.error("Failed to load service requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    setIsCancelling(true);
    try {
      await api.put(`/api/v1/services/${id}/cancel`, {
        reason: cancelReason.trim(),
      });
      toast.success("Service request cancelled");
      setCancellingId(null);
      setCancelReason("");
      fetchRequests();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(
        axiosErr?.response?.data?.message || "Failed to cancel request"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = (status: ServiceStatus) => {
    return !["COMPLETED", "CLOSED", "CANCELLED"].includes(status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Form Tracking</h2>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-2xl">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            No service requests
          </h3>
          <p className="text-gray-500">
            You haven&apos;t submitted any service forms yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const { step, isRejected, isCancelled } = getStepFromStatus(
              req.status
            );
            const config = STATUS_CONFIG[req.status];
            const isExpanded = expandedId === req.id;
            const details = getFormDetails(req);
            const hiddenFields = [
              "id",
              "serviceRequestId",
              "createdAt",
              "updatedAt",
            ];

            // Find rejection reason from action logs
            const rejectionLog = req.actionLogs.find(
              (l) =>
                l.action.toLowerCase().includes("rejected") ||
                l.action.toLowerCase().includes("reject")
            );

            return (
              <div
                key={req.id}
                className={`bg-white border rounded-xl overflow-hidden transition-shadow hover:shadow-md ${
                  isCancelled ? "opacity-70" : ""
                }`}
              >
                {/* Header */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-gray-400">
                        Form ID: #{req.id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Date:{" "}
                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
                      >
                        Status: {config.label}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        Type: {SERVICE_TYPE_LABELS[req.serviceType]}
                      </span>
                    </div>
                  </div>

                  {/* Step Indicator */}
                  <StepIndicator
                    step={step}
                    isRejected={isRejected}
                    isCancelled={isCancelled}
                  />

                  {/* Rejection reason */}
                  {isRejected && rejectionLog?.notes && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-700">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-red-600">
                          {rejectionLog.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-2 px-5 pb-4">
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : req.id)
                    }
                    className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" /> Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" /> View Details
                      </>
                    )}
                  </button>
                  {canCancel(req.status) && (
                    <button
                      onClick={() =>
                        setCancellingId(
                          cancellingId === req.id ? null : req.id
                        )
                      }
                      className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors"
                    >
                      <XCircle className="h-4 w-4" /> Withdraw
                    </button>
                  )}
                </div>

                {/* Cancel dialog */}
                {cancellingId === req.id && (
                  <div className="px-5 pb-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-red-700 mb-2">
                        Why do you want to withdraw this request?
                      </p>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Please provide a reason..."
                        rows={3}
                        className="w-full border border-red-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleCancel(req.id)}
                          disabled={isCancelling}
                          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          {isCancelling ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Confirm Withdrawal
                        </button>
                        <button
                          onClick={() => {
                            setCancellingId(null);
                            setCancelReason("");
                          }}
                          className="px-4 py-2 bg-white border text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 px-5 py-4 space-y-4">
                    {/* Submitted Form Data */}
                    {details && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Submitted Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(details)
                            .filter(
                              ([key]) => !hiddenFields.includes(key)
                            )
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="bg-white rounded-lg p-3 border"
                              >
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                  {formatFieldName(key)}
                                </p>
                                <p className="text-sm text-gray-800 mt-0.5 break-words">
                                  {formatFieldValue(value)}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Action Logs / Timeline */}
                    {req.actionLogs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Activity Timeline
                        </h4>
                        <div className="space-y-2">
                          {req.actionLogs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-start gap-3 bg-white rounded-lg p-3 border"
                            >
                              <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">
                                  {log.action}
                                </p>
                                {log.notes && (
                                  <p className="text-sm text-gray-500 mt-0.5">
                                    {log.notes}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(log.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingId && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => {
            setCancellingId(null);
            setCancelReason("");
          }}
        />
      )}
    </div>
  );
}
