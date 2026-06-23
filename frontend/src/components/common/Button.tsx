import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "google";
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: "bg-primary",
  outline: "bg-surface border border-border",
  google: "bg-surface border border-danger",
};

const textStyles: Record<string, string> = {
  primary: "text-white",
  outline: "text-textprimary",
  google: "text-danger",
};

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = [
    "flex-row items-center justify-center rounded-lg py-3 px-6 font-bold",
    variantStyles[variant],
    isDisabled ? "opacity-50" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={classes}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#ffffff" : "#dc2626"} size="small" className="mr-2" />
      ) : null}
      <Text className={["text-base font-bold", textStyles[variant]].join(" ")}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
