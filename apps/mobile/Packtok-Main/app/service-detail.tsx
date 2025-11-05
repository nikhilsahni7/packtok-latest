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
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ServiceStatus,
  ServiceType,
  useServiceRequestDetails,
} from "../hooks/useServiceRequests";
import { useAuthStore } from "../store/auth-store";

export default function ServiceDetailScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: service,
    isLoading,
    refetch,
  } = useServiceRequestDetails(id || "");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getServiceTypeDisplay = (serviceType: ServiceType) => {
    const serviceTypeMap: Record<ServiceType, string> = {
      MAINTENANCE: "Maintenance Service",
      CONSULTANCY: "Consultancy Service",
      TURNKEY_PROJECT: "Turnkey Service",
      COMPANY_ACQUISITION: "Company Acquisition",
      MANPOWER_HIRING: "Manpower Hiring",
      JOB_SEEKER_SUBMISSION: "Job Seeker",
    };
    return serviceTypeMap[serviceType] || serviceType;
  };

  const getStatusBadgeStyle = (status: ServiceStatus) => {
    const statusStyles: Record<
      ServiceStatus,
      { bg: string; text: string; label: string }
    > = {
      SUBMITTED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "SUBMITTED",
      },
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
    return statusStyles[status] || statusStyles.SUBMITTED;
  };

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

  const getTimelineSteps = () => {
    const baseSteps = [
      { label: "Information Submitted", status: "completed" },
      { label: "Identity Verification", status: "in-progress" },
      { label: "Approved by Packtok", status: "pending" },
    ];

    if (!service) return baseSteps;

    // Update based on actual service status
    if (
      service.status === "SUBMITTED" ||
      service.status === "AWAITING_ASSIGNMENT"
    ) {
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "in-progress" },
        { label: "Approved by Packtok", status: "pending" },
      ];
    } else if (service.status === "IN_REVIEW") {
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "completed" },
        { label: "Under Review", status: "in-progress" },
        { label: "Approved by Packtok", status: "pending" },
      ];
    } else if (
      service.status === "APPROVED" ||
      service.status === "IN_PROGRESS"
    ) {
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "completed" },
        { label: "Approved by Packtok", status: "completed" },
      ];
    } else if (service.status === "COMPLETED") {
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "completed" },
        { label: "Approved by Packtok", status: "completed" },
        { label: "Service Completed", status: "completed" },
      ];
    } else if (
      service.status === "REJECTED" ||
      service.status === "CANCELLED"
    ) {
      return [
        { label: "Information Submitted", status: "completed" },
        { label: "Identity Verification", status: "completed" },
        {
          label: service.status === "REJECTED" ? "Rejected" : "Cancelled",
          status: "rejected",
        },
      ];
    }

    return baseSteps;
  };

  if (isLoading || !service) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusBadgeStyle(service.status);
  const timelineSteps = getTimelineSteps();

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
          Service Form History
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Service Info Card */}
        <View className="px-5 py-6 bg-gray-50">
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {getServiceTypeDisplay(service.serviceType)}
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

            {/* Company Name (if available) */}
            {(service.maintenanceRequest?.companyName ||
              service.consultancyRequest?.companyName ||
              service.turnkeyProjectInquiry?.companyName ||
              service.companyAcquisitionInquiry?.companyName ||
              service.manpowerHiringRequest?.companyName) && (
              <View className="flex-row items-center">
                <Feather name="briefcase" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-700 ml-2">
                  {service.maintenanceRequest?.companyName ||
                    service.consultancyRequest?.companyName ||
                    service.turnkeyProjectInquiry?.companyName ||
                    service.companyAcquisitionInquiry?.companyName ||
                    service.manpowerHiringRequest?.companyName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Timeline */}
        <View className="px-5 py-6">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            Service Timeline
          </Text>

          <View className="space-y-4">
            {timelineSteps.map((step, index) => (
              <View key={index} className="flex-row">
                {/* Icon Column */}
                <View className="items-center mr-4">
                  {/* Icon */}
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

        {/* Action Logs / Admin Remarks */}
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
      </ScrollView>
    </SafeAreaView>
  );
}
