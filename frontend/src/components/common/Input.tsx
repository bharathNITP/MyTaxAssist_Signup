import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps, Platform } from "react-native";

interface InputProps extends Omit<TextInputProps, "className"> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  required?: boolean;
}

export default function Input({ label, error, rightIcon, onRightIconPress, required, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = error ? "border-danger" : isFocused ? "border-info" : "border-border";
  return (
    <View className="mb-4">
      {label ? (
        <Text className="text-sm font-semibold text-textsecondary mb-1.5">
          {label}
          {required ? <Text className="text-danger">*</Text> : null}
        </Text>
      ) : null}
      <View className={"flex-row items-center rounded-lg border bg-surface px-3 py-2.5 " + borderColor}>
        <TextInput className="flex-1 text-base text-textprimary" style={Platform.OS === 'web' ? ({ outlineStyle: 'none', borderWidth: 0 } as any) : undefined} placeholderTextColor="#8a7860" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} {...props} />
        {rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} className="ml-2 p-1" accessibilityRole="button" accessibilityLabel={props.secureTextEntry ? "Show password" : "Hide password"}>
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text className="mt-1 text-xs text-danger">{error}</Text> : null}
    </View>
  );
}