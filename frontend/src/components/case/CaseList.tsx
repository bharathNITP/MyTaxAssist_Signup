import React from 'react';
import { View, Text } from 'react-native';

interface CaseListProps {
  // Define props here
}

export default function CaseList({}: CaseListProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">CaseList Component</Text>
    </View>
  );
}
