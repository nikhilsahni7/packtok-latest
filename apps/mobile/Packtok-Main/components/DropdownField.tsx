import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type DropdownFieldProps = {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onSelect: (nextValue: string) => void;
};

export default function DropdownField({
  label,
  value,
  options,
  placeholder = "Select",
  disabled,
  onSelect,
}: DropdownFieldProps) {
  const [open, setOpen] = useState(false);
  const hasOptions = options.length > 0;

  const displayValue = useMemo(() => {
    if (!value) return placeholder;
    return value;
  }, [value, placeholder]);

  const onOpen = () => {
    if (disabled || !hasOptions) return;
    setOpen(true);
  };

  const selectOption = (nextValue: string) => {
    onSelect(nextValue);
    setOpen(false);
  };

  return (
    <View>
      <Text className="text-xs font-semibold text-gray-700 mb-2">{label}</Text>
      <TouchableOpacity
        onPress={onOpen}
        disabled={disabled || !hasOptions}
        className={`rounded-xl border px-4 py-3 flex-row items-center justify-between ${
          disabled || !hasOptions
            ? "bg-gray-100 border-gray-200"
            : "bg-white border-gray-300"
        }`}
      >
        <Text
          className={`text-sm ${value ? "text-gray-900" : "text-gray-500"}`}
          numberOfLines={1}
        >
          {displayValue}
        </Text>
        <Feather name="chevron-down" size={16} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View className="flex-1 bg-black/35 items-center justify-center px-5">
            <TouchableWithoutFeedback>
              <View className="w-full max-w-md rounded-2xl bg-white p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-base font-semibold text-gray-900">
                    {label}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                  >
                    <Feather name="x" size={14} color="#111827" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ maxHeight: 320 }}>
                  {options.map((option) => {
                    const selected = option === value;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => selectOption(option)}
                        className={`px-3 py-3 rounded-xl mb-2 border ${
                          selected
                            ? "border-black bg-gray-100"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            selected ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
