import React from 'react';
import { View, Text } from 'react-native';

interface UploadButtonProps {
  // Define props here
}

export default function UploadButton({}: UploadButtonProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">UploadButton Component</Text>
    </View>
  );
}
