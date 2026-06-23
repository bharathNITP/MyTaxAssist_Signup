import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Deduction80DFormData } from "../../../../shared-types/deduction80D.types";
import { deduction80DFormSchema } from "../../validation/deduction80DSchema";
import Deduction80DForm from "./Deduction80DForm";

interface Add80DModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Deduction80DFormData) => Promise<void>;
  submitting: boolean;
}

export default function Add80DModal({ isOpen, onClose, onSubmit, submitting }: Add80DModalProps) {
  const form = useForm<Deduction80DFormData>({
    resolver: yupResolver(deduction80DFormSchema),
    defaultValues: {
      In_respect_of: "",
      Age_Group: "",
      Kind_of_payment: "",
      type_of_policy: "",
      Name_of_Insurance_company: "",
      Policy_number: "",
      Premium_Amount: "",
      Amount: "",
      Deduction_Note: "",
      Deduction_80D_Files: [],
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    form.reset();
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}
      className="bg-black/55 items-center justify-center p-5"
    >
      <View className="w-full max-w-md bg-surface rounded-xl border border-border shadow-2xl">
        <View className="flex-row items-center px-5 py-4 border-b border-border">
          <View>
            <Text className="text-panel-title text-textprimary">Add 80D Deduction</Text>
            <Text className="text-meta text-textmuted mt-0.5">Enter medical insurance deduction details</Text>
          </View>
          <TouchableOpacity
            className="ml-auto w-8 h-8 rounded-md border border-border items-center justify-center"
            onPress={handleClose}
          >
            <Text className="text-textmuted font-bold">x</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          className="px-5 py-4"
          style={Platform.OS === "web" ? { maxHeight: 400, overflowY: "auto" as const } : { maxHeight: 400 }}
          showsVerticalScrollIndicator={false}
        >
          <Deduction80DForm form={form} />
        </ScrollView>
        <View className="h-px bg-warning/60 mx-5" />
        <View className="px-5 py-3.5 flex-row justify-start">
          <TouchableOpacity
            className={submitting ? "px-4 py-2.5 rounded-lg bg-primary/60" : "px-4 py-2.5 rounded-lg bg-primary"}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text className="text-button text-white font-bold">
              {submitting ? "Submitting..." : "Add 80D Details"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
