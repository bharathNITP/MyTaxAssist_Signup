import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  // Define props here
}

export default function Badge({}: BadgeProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">Badge Component</Text>
    </View>
  );
}
