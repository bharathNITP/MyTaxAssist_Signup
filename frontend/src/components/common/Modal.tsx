import React from 'react';
import { View, Text } from 'react-native';

interface ModalProps {
  // Define props here
}

export default function Modal({}: ModalProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold">Modal Component</Text>
    </View>
  );
}
