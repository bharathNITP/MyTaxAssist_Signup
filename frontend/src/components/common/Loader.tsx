import React from 'react';
import { View, Text } from 'react-native';

interface LoaderProps {
  // Define props here
}

export default function Loader({}: LoaderProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">Loader Component</Text>
    </View>
  );
}
