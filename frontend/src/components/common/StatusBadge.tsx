import React from 'react';
import { View, Text } from 'react-native';

interface StatusBadgeProps {
  // Define props here
}

export default function StatusBadge({}: StatusBadgeProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">StatusBadge Component</Text>
    </View>
  );
}
