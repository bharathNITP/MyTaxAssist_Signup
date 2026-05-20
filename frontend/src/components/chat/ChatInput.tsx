import React from 'react';
import { View, Text } from 'react-native';

interface ChatInputProps {
  // Define props here
}

export default function ChatInput({}: ChatInputProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">ChatInput Component</Text>
    </View>
  );
}
