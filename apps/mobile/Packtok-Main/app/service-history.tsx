import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ServiceRequest,
  ServiceStatus,
  ServiceType,
  useMyServiceRequests,
} from "../hooks/useServiceRequests";

export default function ServiceHistoryScreen() {
  const router = useRouter();
  const { data: services, isLoading, refetch } = useMyServiceRequests();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("past");

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
        label: "CONFIRMED",
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "long",
    });
  };

  const filterServices = (services: ServiceRequest[]) => {
    if (activeTab === "upcoming") {
      return services.filter(
        (s) =>
          s.status === "SUBMITTED" ||
          s.status === "AWAITING_ASSIGNMENT" ||
          s.status === "IN_REVIEW" ||
          s.status === "IN_PROGRESS" ||
          s.status === "APPROVED"
      );
    }
    return services.filter(
      (s) =>
        s.status === "COMPLETED" ||
        s.status === "CLOSED" ||
        s.status === "CANCELLED" ||
        s.status === "REJECTED"
    );
  };

  const filteredServices = services ? filterServices(services) : [];

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
        <View className="w-12 h-12 rounded-full bg-orange-500 items-center justify-center mr-3">
          <Feather name="clipboard" size={24} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-gray-900">
          Service Form History
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-5 py-3 gap-2">
        <TouchableOpacity
          onPress={() => setActiveTab("upcoming")}
          className={`flex-1 py-3 rounded-lg border ${
            activeTab === "upcoming"
              ? "bg-white border-[#6366F1]"
              : "bg-gray-50 border-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "upcoming" ? "text-[#6366F1]" : "text-gray-600"
            }`}
          >
            UPCOMING
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("past")}
          className={`flex-1 py-3 rounded-lg border ${
            activeTab === "past"
              ? "bg-[#6366F1] border-[#6366F1]"
              : "bg-gray-50 border-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "past" ? "text-white" : "text-gray-600"
            }`}
          >
            PAST
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : filteredServices.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20 px-5">
            <Feather name="inbox" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">
              No {activeTab} service requests
            </Text>
          </View>
        ) : (
          <View className="px-5 py-4 gap-4">
            {filteredServices.map((service) => {
              const statusStyle = getStatusBadgeStyle(service.status);
              return (
                <TouchableOpacity
                  key={service.id}
                  onPress={() =>
                    router.push(`/service-detail?id=${service.id}`)
                  }
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                  activeOpacity={0.7}
                >
                  {/* Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 mb-1">
                        {getServiceTypeDisplay(service.serviceType)}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Booking ID: {service.id.slice(0, 8).toUpperCase()}
                      </Text>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${statusStyle.bg}`}
                    >
                      <Text
                        className={`text-xs font-semibold ${statusStyle.text}`}
                      >
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>

                  {/* Company Name (if available) */}
                  {(service.maintenanceRequest?.companyName ||
                    service.consultancyRequest?.companyName ||
                    service.turnkeyProjectInquiry?.companyName ||
                    service.companyAcquisitionInquiry?.companyName ||
                    service.manpowerHiringRequest?.companyName) && (
                    <View className="flex-row items-center mb-2">
                      <Feather name="briefcase" size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-700 ml-2">
                        {service.maintenanceRequest?.companyName ||
                          service.consultancyRequest?.companyName ||
                          service.turnkeyProjectInquiry?.companyName ||
                          service.companyAcquisitionInquiry?.companyName ||
                          service.manpowerHiringRequest?.companyName}
                      </Text>
                    </View>
                  )}

                  {/* Date */}
                  <View className="flex-row items-center mb-3">
                    <Feather name="calendar" size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {formatDate(service.createdAt)}
                    </Text>
                  </View>

                  {/* Actions */}
                  {activeTab === "past" && (
                    <View className="flex-row gap-2 mt-3 pt-3 border-t border-gray-100">
                      <TouchableOpacity
                        onPress={() =>
                          router.push(`/service-detail?id=${service.id}`)
                        }
                        className="flex-1 py-2 border border-[#6366F1] rounded-lg"
                        activeOpacity={0.7}
                      >
                        <Text className="text-[#6366F1] text-center font-semibold text-sm">
                          VIEW DETAILS
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeTab === "upcoming" && (
                    <View className="flex-row gap-2 mt-3 pt-3 border-t border-gray-100">
                      <TouchableOpacity
                        className="flex-1 py-2 border border-[#6366F1] rounded-lg"
                        activeOpacity={0.7}
                      >
                        <Text className="text-[#6366F1] text-center font-semibold text-sm">
                          CALL
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 py-2 bg-red-500 rounded-lg"
                        activeOpacity={0.7}
                      >
                        <Text className="text-white text-center font-semibold text-sm">
                          CANCEL
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
