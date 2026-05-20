import React from 'react';
import { View, Text } from 'react-native';

interface ErrorStateProps {
  // Define props here
}

export default function ErrorState({}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">ErrorState Component</Text>
    </View>
  );
}
