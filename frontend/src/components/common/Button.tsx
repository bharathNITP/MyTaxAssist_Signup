import React from 'react';
import { View, Text } from 'react-native';

interface ButtonProps {
  // Define props here
}

export default function Button({}: ButtonProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">Button Component</Text>
    </View>
  );
}
