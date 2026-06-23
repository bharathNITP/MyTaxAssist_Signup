import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BankFormData } from '../../../../shared-types/bank.types';
import { bankFormSchema } from '../../validation/bankSchema';
import BankDetailsForm from './BankDetailsForm';

interface UpdateBankDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BankFormData) => Promise<void>;
  submitting: boolean;
  initialData: BankFormData | null;
}

export default function UpdateBankDetailsModal({ isOpen, onClose, onSubmit, submitting, initialData }: UpdateBankDetailsModalProps) {
  const form = useForm<BankFormData>({
    resolver: yupResolver(bankFormSchema),
    defaultValues: { Bank_Name: '', Account_Number: '', IFSC_Code: '', Account_Type: 'Savings Account', Primary_Account: false },
  });
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);
  const handleSubmit = form.handleSubmit(async (data) => { await onSubmit(data); form.reset(); });
  const handleClose = () => { form.reset(); onClose(); };
  if (!isOpen) return null;
  return (
    <View style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }} className="bg-black/55 items-center justify-center p-5">
      <View className="w-full max-w-md bg-surface rounded-xl border border-border overflow-hidden shadow-2xl">
        <View className="flex-row items-center px-5 py-4 border-b border-border">
          <View><Text className="text-panel-title text-textprimary">Update Bank Details</Text><Text className="text-meta text-textmuted mt-0.5">Modify your bank account information</Text></View>
          <TouchableOpacity className="ml-auto w-8 h-8 rounded-md border border-border items-center justify-center" onPress={handleClose}><Text className="text-textmuted font-bold">x</Text></TouchableOpacity>
        </View>
        <ScrollView className="px-5 py-4 max-h-96"><BankDetailsForm form={form} /></ScrollView>
        <View className="h-px bg-warning/60 mx-5" />
        <View className="px-5 py-3.5 flex-row justify-start">
          <TouchableOpacity className={submitting ? "px-4 py-2.5 rounded-lg bg-primary/60" : "px-4 py-2.5 rounded-lg bg-primary"} onPress={handleSubmit} disabled={submitting}>
            <Text className="text-button text-white font-bold">{submitting ? "Updating..." : "Update Bank Details"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}