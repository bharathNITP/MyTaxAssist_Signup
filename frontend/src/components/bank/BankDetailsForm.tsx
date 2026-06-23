import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useController, UseFormReturn } from "react-hook-form";
import { BankFormData, ACCOUNT_TYPE_OPTIONS } from "../../../../shared-types/bank.types";

interface BankDetailsFormProps {
  form: UseFormReturn<BankFormData>;
}

export default function BankDetailsForm({ form }: BankDetailsFormProps) {
  const { control, formState: { errors } } = form;
  const bankNameField = useController({ control, name: "Bank_Name", defaultValue: "" });
  const accountNumberField = useController({ control, name: "Account_Number", defaultValue: "" });
  const ifscField = useController({ control, name: "IFSC_Code", defaultValue: "" });
  const accountTypeField = useController({ control, name: "Account_Type", defaultValue: "Savings Account" });
  const primaryField = useController({ control, name: "Primary_Account", defaultValue: false });
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <View className="gap-4">
      <View>
        <Text className="text-supporting text-textmuted mb-1">Bank Name <Text className="text-danger">*</Text></Text>
        <TextInput className="border border-border rounded-md px-3 py-2.5 text-body text-textprimary bg-surface" placeholder="Bank Name" placeholderTextColor="#8a7860" value={bankNameField.field.value} onChangeText={bankNameField.field.onChange} />
        {errors.Bank_Name && <Text className="text-danger text-supporting mt-1">{errors.Bank_Name.message}</Text>}
      </View>
      <View>
        <Text className="text-supporting text-textmuted mb-1">Account Number <Text className="text-danger">*</Text></Text>
        <TextInput className="border border-border rounded-md px-3 py-2.5 text-body text-textprimary bg-surface" placeholder="Account Number" placeholderTextColor="#8a7860" keyboardType="number-pad" value={accountNumberField.field.value} onChangeText={accountNumberField.field.onChange} />
        {errors.Account_Number && <Text className="text-danger text-supporting mt-1">{errors.Account_Number.message}</Text>}
      </View>
      <View>
        <Text className="text-supporting text-textmuted mb-1">IFSC Code <Text className="text-danger">*</Text></Text>
        <TextInput className="border border-border rounded-md px-3 py-2.5 text-body text-textprimary bg-surface" placeholder="IFSC Code" placeholderTextColor="#8a7860" autoCapitalize="characters" value={ifscField.field.value} onChangeText={ifscField.field.onChange} />
        {errors.IFSC_Code && <Text className="text-danger text-supporting mt-1">{errors.IFSC_Code.message}</Text>}
      </View>
      <View className="relative z-10">
        <Text className="text-supporting text-textmuted mb-1">Account Type <Text className="text-danger">*</Text></Text>
        <TouchableOpacity className="border border-border rounded-md px-3 py-2.5 bg-surface" onPress={() => setDropdownOpen(!dropdownOpen)}>
          <Text className="text-body text-textprimary">{accountTypeField.field.value}</Text>
        </TouchableOpacity>
        {dropdownOpen && (
          <View className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md bg-surface shadow-lg z-20 max-h-60">
            {ACCOUNT_TYPE_OPTIONS.map((option) => (
              <TouchableOpacity key={option} className="px-3 py-2.5 border-b border-border last:border-b-0" onPress={() => { accountTypeField.field.onChange(option); setDropdownOpen(false); }}>
                <Text className="text-body text-textprimary">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {errors.Account_Type && <Text className="text-danger text-supporting mt-1">{errors.Account_Type.message}</Text>}
      </View>
      <TouchableOpacity className="flex-row items-center gap-2 py-1" onPress={() => primaryField.field.onChange(!primaryField.field.value)}>
        <View className={primaryField.field.value ? "w-5 h-5 border-2 rounded-sm items-center justify-center bg-primary border-primary" : "w-5 h-5 border-2 rounded-sm items-center justify-center border-border"}>
          {primaryField.field.value && <Text className="text-white text-xs font-bold">{String.fromCharCode(10003)}</Text>}
        </View>
        <Text className="text-body text-textsecondary">Choose this account as Primary account</Text>
      </TouchableOpacity>
    </View>
  );
}