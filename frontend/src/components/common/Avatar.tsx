import React from 'react';
import { View, Text } from 'react-native';

interface AvatarProps {
  // Define props here
}

export default function Avatar({}: AvatarProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">Avatar Component</Text>
    </View>
  );
}
