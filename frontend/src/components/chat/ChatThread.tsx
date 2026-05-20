import React from 'react';
import { View, Text } from 'react-native';

interface ChatThreadProps {
  // Define props here
}

export default function ChatThread({}: ChatThreadProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">ChatThread Component</Text>
    </View>
  );
}
