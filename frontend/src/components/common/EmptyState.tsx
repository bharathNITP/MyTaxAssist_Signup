import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  // Define props here
}

export default function EmptyState({}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">EmptyState Component</Text>
    </View>
  );
}
