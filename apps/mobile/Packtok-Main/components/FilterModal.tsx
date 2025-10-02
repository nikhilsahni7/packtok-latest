import { useCategories } from "@/hooks/useCategories";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface FilterState {
  categories: string[];
  priceRanges: string[];
  conditions: string[];
  machineTypes: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const PRICE_RANGES = [
  { label: "0 - 50k Lakhs", value: "0-50000" },
  { label: "50k - 1L Lakhs", value: "50000-100000" },
  { label: "1L - 2.5L Lakhs", value: "100000-250000" },
  { label: "2.5L - 5L Lakhs", value: "250000-500000" },
  { label: "5L+ Lakhs", value: "500000" },
];

const CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
];

const MACHINE_TYPES = [
  { value: "MONO_CARTON", label: "Mono Carton" },
  { value: "MASTER_CARTON", label: "Master Carton" },
  { value: "BOTH", label: "Both" },
  { value: "OTHER", label: "Other" },
];

export default function FilterModal({
  visible,
  onClose,
  filterState,
  onFilterChange,
}: FilterModalProps) {
  const [tempFilters, setTempFilters] = useState<FilterState>(filterState);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    if (visible) {
      setTempFilters(filterState);
    }
  }, [visible, filterState]);

  const toggleFilter = (
    type: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter((v) => v !== value),
    }));
  };

  const handleReset = () => {
    const emptyFilters: FilterState = {
      categories: [],
      priceRanges: [],
      conditions: [],
      machineTypes: [],
    };
    setTempFilters(emptyFilters);
  };

  const handleApply = () => {
    onFilterChange(tempFilters);
    onClose();
  };

  const hasActiveFilters =
    tempFilters.categories.length > 0 ||
    tempFilters.priceRanges.length > 0 ||
    tempFilters.conditions.length > 0 ||
    tempFilters.machineTypes.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 bg-gray-300 rounded" />
              <Text className="text-xl font-bold text-gray-900">Filters</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center bg-gray-100 rounded-full"
            >
              <Feather name="x" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Filter Content */}
          <ScrollView className="flex-1 px-6 py-4">
            {/* Categories Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                CATEGORIES
              </Text>
              {categoriesLoading ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="#FF6B2C" />
                </View>
              ) : (
                <View className="space-y-3">
                  {categories?.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() =>
                        toggleFilter(
                          "categories",
                          category.id,
                          !tempFilters.categories.includes(category.id)
                        )
                      }
                      className="flex-row items-center py-2"
                      activeOpacity={0.7}
                    >
                      <View
                        className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                          tempFilters.categories.includes(category.id)
                            ? "bg-orange-500 border-orange-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {tempFilters.categories.includes(category.id) && (
                          <MaterialIcons name="check" size={16} color="white" />
                        )}
                      </View>
                      <Text className="text-sm text-gray-700 flex-1">
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Price Range Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                PRICE RANGE
              </Text>
              <View className="space-y-3">
                {PRICE_RANGES.map((range) => (
                  <TouchableOpacity
                    key={range.value}
                    onPress={() =>
                      toggleFilter(
                        "priceRanges",
                        range.value,
                        !tempFilters.priceRanges.includes(range.value)
                      )
                    }
                    className="flex-row items-center py-2"
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                        tempFilters.priceRanges.includes(range.value)
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {tempFilters.priceRanges.includes(range.value) && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                    <Text className="text-sm text-gray-700 flex-1">
                      ₹{range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Condition Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                CONDITION
              </Text>
              <View className="space-y-3">
                {CONDITIONS.map((condition) => (
                  <TouchableOpacity
                    key={condition.value}
                    onPress={() =>
                      toggleFilter(
                        "conditions",
                        condition.value,
                        !tempFilters.conditions.includes(condition.value)
                      )
                    }
                    className="flex-row items-center py-2"
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                        tempFilters.conditions.includes(condition.value)
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {tempFilters.conditions.includes(condition.value) && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                    <Text className="text-sm text-gray-700 flex-1">
                      {condition.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Machine Type Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                MACHINE TYPE
              </Text>
              <View className="space-y-3">
                {MACHINE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() =>
                      toggleFilter(
                        "machineTypes",
                        type.value,
                        !tempFilters.machineTypes.includes(type.value)
                      )
                    }
                    className="flex-row items-center py-2"
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                        tempFilters.machineTypes.includes(type.value)
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {tempFilters.machineTypes.includes(type.value) && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                    <Text className="text-sm text-gray-700 flex-1">
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="px-6 py-4 border-t border-gray-200 bg-white">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleReset}
                className="flex-1 bg-gray-100 rounded-lg py-4 items-center justify-center"
                disabled={!hasActiveFilters}
              >
                <Text
                  className={`font-semibold ${
                    hasActiveFilters ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="flex-1 bg-orange-500 rounded-lg py-4 items-center justify-center"
                style={{
                  shadowColor: "#FF6B2C",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Text className="text-white font-semibold">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
