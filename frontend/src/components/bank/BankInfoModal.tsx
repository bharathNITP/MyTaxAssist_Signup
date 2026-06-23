import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BankRecord } from '../../../../shared-types/bank.types';

interface BankInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: BankRecord | null;
}

function mask(acc: string): string {
  if (acc.length <= 4) return acc;
  return "*".repeat(acc.length - 4) + acc.slice(-4);
}

export default function BankInfoModal({ isOpen, onClose, record }: BankInfoModalProps) {
  if (!isOpen || !record) return null;
  const rows = [
    { label: "Bank Name", value: record.Bank_Name },
    { label: "Account Number", value: mask(record.Account_Number) },
    { label: "IFSC Code", value: record.IFSC_Code },
    { label: "Account Type", value: record.Account_Type },
    { label: "Account Status", value: record.Primary_Account },
    { label: "Bank ID", value: record.Bank_ID },
  ];
  return (
    <View style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }} className="bg-black/55 items-center justify-center p-5">
      <View className="w-full max-w-md bg-surface rounded-xl border border-border overflow-hidden shadow-2xl">
        <View className="flex-row items-center px-5 py-4 border-b border-border">
          <Text className="text-panel-title text-textprimary">Bank Details</Text>
          <TouchableOpacity className="ml-auto w-8 h-8 rounded-md border border-border items-center justify-center" onPress={onClose}><Text className="text-textmuted font-bold">x</Text></TouchableOpacity>
        </View>
        <ScrollView className="px-5 py-4">
          {rows.map((r, i) => (
            <View key={i} className="flex-row justify-between items-center py-3 px-3.5 rounded-md mb-1.5" style={{ backgroundColor: i % 2 === 0 ? "#fafaf8" : "#ffffff" }}>
              <Text className="text-supporting text-textmuted font-semibold min-w-[120px]">{r.label}</Text>
              <Text className="text-body text-textprimary font-bold text-right">{r.value}</Text>
            </View>
          ))}
        </ScrollView>
        <View className="px-5 py-3.5 flex-row justify-end border-t border-border">
          <TouchableOpacity className="px-4 py-2 rounded-lg bg-card border border-border" onPress={onClose}><Text className="text-button text-textsecondary">Close</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}