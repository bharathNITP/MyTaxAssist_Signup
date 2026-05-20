import React from 'react';
import { View, Text } from 'react-native';

interface DocumentCardProps {
  // Define props here
}

export default function DocumentCard({}: DocumentCardProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">DocumentCard Component</Text>
    </View>
  );
}
