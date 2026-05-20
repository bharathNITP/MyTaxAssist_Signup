import React from 'react';
import { View, Text } from 'react-native';

interface CaseCardProps {
  // Define props here
}

export default function CaseCard({}: CaseCardProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">CaseCard Component</Text>
    </View>
  );
}
