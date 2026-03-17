import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type VendorButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "danger"
  | "success"
  | "info";

type VendorButtonSize = "sm" | "md" | "lg";

type VendorButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: VendorButtonVariant;
  size?: VendorButtonSize;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
};

const variantClasses: Record<VendorButtonVariant, string> = {
  primary: "bg-black border border-black",
  accent: "bg-orange-500 border border-orange-500",
  secondary: "bg-white border border-gray-300",
  danger: "bg-red-600 border border-red-600",
  success: "bg-emerald-600 border border-emerald-600",
  info: "bg-blue-600 border border-blue-600",
};

const variantTextClasses: Record<VendorButtonVariant, string> = {
  primary: "text-white",
  accent: "text-white",
  secondary: "text-gray-800",
  danger: "text-white",
  success: "text-white",
  info: "text-white",
};

const sizeClasses: Record<VendorButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-4",
  lg: "h-12 px-4",
};

export default function VendorButton({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  textClassName,
}: VendorButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`rounded-xl items-center justify-center ${fullWidth ? "self-stretch" : "self-start"} ${sizeClasses[size]} ${variantClasses[variant]} ${isDisabled ? "opacity-55" : "opacity-100"} ${className || ""}`}
      style={{
        shadowColor: "#111827",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: isDisabled ? 0 : 0.08,
        shadowRadius: 10,
        elevation: isDisabled ? 0 : 2,
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "secondary" ? "#111827" : "#FFFFFF"}
        />
      ) : (
        <Text
          className={`text-sm font-semibold ${variantTextClasses[variant]} ${textClassName || ""}`}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
