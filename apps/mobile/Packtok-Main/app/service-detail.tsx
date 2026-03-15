import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ServiceRequest,
  ServiceStatus,
  ServiceType,
  useCancelServiceRequest,
  useServiceRequestDetails,
} from "../hooks/useServiceRequests";
import { useAuthStore } from "../store/auth-store";

// ── helpers ──────────────────────────────────────────────────────────────────

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  MAINTENANCE: "Maintenance Service",
  CONSULTANCY: "Consultancy Service",
  TURNKEY_PROJECT: "Turnkey Service",
  COMPANY_ACQUISITION: "Company Acquisition",
  MANPOWER_HIRING: "Manpower Hiring",
  JOB_SEEKER_SUBMISSION: "Job Seeker",
  MACHINERY_INSTALLER: "Machinery Installer",
};

const STATUS_STYLES: Record<
  ServiceStatus,
  { bg: string; text: string; label: string }
> = {
  SUBMITTED: { bg: "bg-blue-100", text: "text-blue-800", label: "SUBMITTED" },
  AWAITING_ASSIGNMENT: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "PENDING",
  },
  IN_REVIEW: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    label: "IN REVIEW",
  },
  ACTION_REQUIRED: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    label: "ACTION REQUIRED",
  },
  APPROVED: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "APPROVED",
  },
  REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "REJECTED" },
  IN_PROGRESS: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "ON GOING",
  },
  COMPLETED: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "COMPLETED",
  },
  CLOSED: { bg: "bg-gray-100", text: "text-gray-800", label: "CLOSED" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "CANCELLED" },
};

const HIDDEN_FIELDS = ["id", "serviceRequestId", "createdAt", "updatedAt"];

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/Id$/, "ID")
    .replace(/Url$/, "URL");
}

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  const strVal = String(value);
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

/** Extract the service-specific sub-model from the request */
function getFormDetails(
  service: ServiceRequest
): Record<string, unknown> | null {
  return (
    service.maintenanceRequest ||
    service.consultancyRequest ||
    service.turnkeyProjectInquiry ||
    service.companyAcquisitionInquiry ||
    service.manpowerHiringRequest ||
    service.jobSeekerProfile ||
    service.machineryInstallerRequest ||
    null
  );
}

function canCancel(status: ServiceStatus): boolean {
  return !["COMPLETED", "CLOSED", "CANCELLED"].includes(status);
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " | " +
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

// ── Timeline steps (same logic as web) ───────────────────────────────────────

function getTimelineSteps(status: ServiceStatus) {
  switch (status) {
    case "SUBMITTED":
    case "AWAITING_ASSIGNMENT":
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "in-progress" },
        { label: "Approved by Packtok", status: "pending" },
      ];
    case "IN_REVIEW":
    case "ACTION_REQUIRED":
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "completed" },
        { label: "Under Review", status: "in-progress" },
        { label: "Approved by Packtok", status: "pending" },
      ];
    case "APPROVED":
    case "IN_PROGRESS":
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "completed" },
        { label: "Approved by Packtok", status: "completed" },
      ];
    case "COMPLETED":
    case "CLOSED":
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "completed" },
        { label: "Approved by Packtok", status: "completed" },
        { label: "Service Completed", status: "completed" },
      ];
    case "REJECTED":
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "completed" },
        { label: "Rejected", status: "rejected" },
      ];
    case "CANCELLED":
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Cancelled", status: "rejected" },
      ];
    default:
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "in-progress" },
        { label: "Approved by Packtok", status: "pending" },
      ];
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ServiceDetailScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: service,
    isLoading,
    refetch,
  } = useServiceRequestDetails(id || "");
  const { mutate: cancelService, isPending: isCancelling } =
    useCancelServiceRequest();

  const [refreshing, setRefreshing] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCancelSubmit = () => {
    if (!cancelReason.trim() || !service?.id) return;
    cancelService(
      { id: service.id, reason: cancelReason.trim() },
      {
        onSuccess: () => {
          setShowCancel(false);
          setCancelReason("");
        },
      }
    );
  };

  // ── Loading / error states ──

  if (isLoading || !service) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = STATUS_STYLES[service.status] || STATUS_STYLES.SUBMITTED;
  const timelineSteps = getTimelineSteps(service.status);
  const formDetails = getFormDetails(service);

  // Find company name from any sub-model
  const companyName =
    service.maintenanceRequest?.companyName ||
    service.consultancyRequest?.companyName ||
    service.turnkeyProjectInquiry?.companyName ||
    service.companyAcquisitionInquiry?.companyName ||
    service.manpowerHiringRequest?.companyName ||
    service.machineryInstallerRequest?.companyName;

  // Rejection reason from action logs
  const rejectionLog = service.actionLogs?.find(
    (l) =>
      l.action.toLowerCase().includes("rejected") ||
      l.action.toLowerCase().includes("reject")
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        {user?.profile_image ? (
          <Image
            source={{ uri: user.profile_image }}
            className="w-12 h-12 rounded-full mr-3"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-[#FF8C42] items-center justify-center mr-3">
            <Text className="text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}
        <Text className="text-xl font-bold text-gray-900">
          Service Details
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ── Service Info Card ── */}
        <View className="px-5 py-6 bg-gray-50">
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {SERVICE_TYPE_LABELS[service.serviceType] ||
                    service.serviceType}
                </Text>
                <Text className="text-sm text-gray-600">
                  Booking ID: {service.id.slice(0, 12).toUpperCase()}
                </Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
                <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                  {statusStyle.label}
                </Text>
              </View>
            </View>

            {/* Date & Time */}
            <View className="flex-row items-center mb-2">
              <Feather name="calendar" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-700 ml-2">
                {formatDateTime(service.createdAt)}
              </Text>
            </View>

            {/* Company Name */}
            {companyName && (
              <View className="flex-row items-center">
                <Feather name="briefcase" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-700 ml-2">
                  {companyName}
                </Text>
              </View>
            )}

            {/* Rejection Reason */}
            {service.status === "REJECTED" && rejectionLog?.notes && (
              <View className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex-row items-start">
                <Feather
                  name="alert-triangle"
                  size={16}
                  color="#EF4444"
                />
                <View className="flex-1 ml-2">
                  <Text className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                    Rejection Reason
                  </Text>
                  <Text className="text-sm text-red-600">
                    {rejectionLog.notes}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── Timeline ── */}
        <View className="px-5 py-6">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            Service Timeline
          </Text>

          <View>
            {timelineSteps.map((step, index) => (
              <View key={index} className="flex-row">
                {/* Icon Column */}
                <View className="items-center mr-4">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      step.status === "completed"
                        ? "bg-[#6366F1]"
                        : step.status === "in-progress"
                          ? "bg-[#6366F1]"
                          : step.status === "rejected"
                            ? "bg-red-500"
                            : "bg-white border-2 border-gray-300"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <Feather name="check" size={20} color="white" />
                    ) : step.status === "in-progress" ? (
                      <View className="w-3 h-3 rounded-full bg-white" />
                    ) : step.status === "rejected" ? (
                      <Feather name="x" size={20} color="white" />
                    ) : (
                      <View className="w-3 h-3 rounded-full bg-gray-300" />
                    )}
                  </View>

                  {/* Connector Line */}
                  {index < timelineSteps.length - 1 && (
                    <View
                      className={`w-0.5 h-12 ${
                        step.status === "completed"
                          ? "bg-[#6366F1]"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </View>

                {/* Content Column */}
                <View className="flex-1 pb-4">
                  <Text
                    className={`text-base font-semibold ${
                      step.status === "pending"
                        ? "text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    {step.label}
                  </Text>
                  {step.status === "in-progress" && (
                    <Text className="text-sm text-gray-600 mt-1">
                      In Progress
                    </Text>
                  )}
                  {step.status === "completed" && index === 0 && (
                    <Text className="text-sm text-gray-600 mt-1">
                      {formatDateTime(service.createdAt)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Submitted Form Details (like web) ── */}
        {formDetails && (
          <View className="px-5 py-6 border-t border-gray-200">
            <Text className="text-base font-semibold text-gray-900 mb-4">
              Submitted Information
            </Text>
            <View className="gap-3">
              {Object.entries(formDetails)
                .filter(([key]) => !HIDDEN_FIELDS.includes(key))
                .map(([key, value]) => (
                  <View
                    key={key}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {formatFieldName(key)}
                    </Text>
                    <Text className="text-sm text-gray-900">
                      {formatFieldValue(value)}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* ── Activity Log ── */}
        {service.actionLogs && service.actionLogs.length > 0 && (
          <View className="px-5 py-6 border-t border-gray-200">
            <Text className="text-base font-semibold text-gray-900 mb-4">
              Activity Log
            </Text>

            <View className="bg-gray-50 rounded-2xl p-4">
              {service.actionLogs.map((log, index) => (
                <View
                  key={log.id}
                  className={`pb-4 ${
                    index < service.actionLogs!.length - 1
                      ? "border-b border-gray-200 mb-4"
                      : ""
                  }`}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <Text className="text-sm font-semibold text-gray-900 flex-1">
                      {log.action}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                  {log.notes && (
                    <Text className="text-sm text-gray-600 mt-1">
                      {log.notes}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Withdraw Request ── */}
        {canCancel(service.status) && (
          <View className="px-5 py-6 border-t border-gray-200">
            {!showCancel ? (
              <TouchableOpacity
                onPress={() => setShowCancel(true)}
                className="bg-red-50 px-5 py-3 rounded-xl flex-row items-center justify-center border border-red-100"
                activeOpacity={0.7}
              >
                <Feather name="x-circle" size={16} color="#DC2626" />
                <Text className="text-red-600 font-bold ml-2">
                  Withdraw Request
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                <Text className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                  Reason for Withdrawal
                </Text>
                <TextInput
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  placeholder="Please tell us why you're withdrawing..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="bg-white border border-red-200 rounded-lg p-3 text-sm text-gray-900 font-medium mb-3 h-24"
                  textAlignVertical="top"
                />
                <View className="flex-row justify-end gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setShowCancel(false);
                      setCancelReason("");
                    }}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg"
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-600 text-xs font-bold">
                      Keep Request
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancelSubmit}
                    disabled={isCancelling || !cancelReason.trim()}
                    className={`px-4 py-3 bg-red-600 rounded-lg flex-row items-center ${
                      !cancelReason.trim() || isCancelling ? "opacity-50" : ""
                    }`}
                    activeOpacity={0.7}
                  >
                    {isCancelling ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Feather name="send" size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">
                          Confirm
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
