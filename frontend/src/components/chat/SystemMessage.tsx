import React from 'react';
import { View, Text } from 'react-native';

interface SystemMessageProps {
  // Define props here
}

export default function SystemMessage({}: SystemMessageProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">SystemMessage Component</Text>
    </View>
  );
}
