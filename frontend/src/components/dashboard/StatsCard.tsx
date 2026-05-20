import React from 'react';
import { View, Text } from 'react-native';

interface StatsCardProps {
  // Define props here
}

export default function StatsCard({}: StatsCardProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">StatsCard Component</Text>
    </View>
  );
}
