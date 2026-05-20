import React from 'react';
import { View, Text } from 'react-native';

interface InputProps {
  // Define props here
}

export default function Input({}: InputProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">Input Component</Text>
    </View>
  );
}
