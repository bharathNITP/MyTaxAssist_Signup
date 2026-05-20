import React from 'react';
import { View, Text } from 'react-native';

interface ChatBubbleProps {
  // Define props here
}

export default function ChatBubble({}: ChatBubbleProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">ChatBubble Component</Text>
    </View>
  );
}
