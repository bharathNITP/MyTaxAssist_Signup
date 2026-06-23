import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { useController, UseFormReturn } from "react-hook-form";
import {
  Deduction80DFormData,
  IN_RESPECT_OF_OPTIONS,
  AGE_GROUP_OPTIONS,
  KIND_OF_PAYMENT_OPTIONS,
  TYPE_OF_POLICY_OPTIONS,
} from "../../../../shared-types/deduction80D.types";

interface DropdownFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
  error?: string;
  required?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

function DropdownField({ label, value, options, onSelect, error, required, isOpen, onToggle }: DropdownFieldProps) {
  return (
    <View className="relative">
      <Text className="text-supporting text-textmuted mb-1">
        {label} {required && <Text className="text-danger">*</Text>}
      </Text>
      <TouchableOpacity className="border border-border rounded-md px-3 py-2.5 bg-surface" onPress={onToggle}>
        <Text className={value ? "text-body text-textprimary" : "text-body text-textmuted"}>
          {value || "Choose"}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View
          className="mt-1 border border-border rounded-md bg-surface shadow-lg"
          style={Platform.OS === "web" ? { maxHeight: 200, overflowY: "auto" as const } : { maxHeight: 200 }}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              className="px-3 py-2.5 border-b border-border last:border-b-0"
              onPress={() => { onSelect(opt); onToggle(); }}
            >
              <Text className="text-body text-textprimary">{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {error && <Text className="text-danger text-supporting mt-1">{error}</Text>}
    </View>
  );
}

interface Deduction80DFormProps {
  form: UseFormReturn<Deduction80DFormData>;
}

export default function Deduction80DForm({ form }: Deduction80DFormProps) {
  const { control, watch, formState: { errors } } = form;
  const kindOfPayment = watch("Kind_of_payment");
  const noteValue = watch("Deduction_Note") || "";
  const isMediclaim = kindOfPayment === "Mediclaim premium";

  const inRespectField = useController({ control, name: "In_respect_of", defaultValue: "" });
  const ageGroupField = useController({ control, name: "Age_Group", defaultValue: "" });
  const kindField = useController({ control, name: "Kind_of_payment", defaultValue: "" });
  const typePolicyField = useController({ control, name: "type_of_policy", defaultValue: "" });
  const insuranceCompanyField = useController({ control, name: "Name_of_Insurance_company", defaultValue: "" });
  const policyNumberField = useController({ control, name: "Policy_number", defaultValue: "" });
  const premiumAmountField = useController({ control, name: "Premium_Amount", defaultValue: "" });
  const amountField = useController({ control, name: "Amount", defaultValue: "" });
  const noteField = useController({ control, name: "Deduction_Note", defaultValue: "" });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <View className="gap-4">
      <DropdownField
        label="In respect of"
        value={inRespectField.field.value}
        options={IN_RESPECT_OF_OPTIONS}
        onSelect={inRespectField.field.onChange}
        error={errors.In_respect_of?.message}
        required
        isOpen={openDropdown === "in-respect-of"}
        onToggle={() => toggleDropdown("in-respect-of")}
      />

      <DropdownField
        label="Age group"
        value={ageGroupField.field.value}
        options={AGE_GROUP_OPTIONS}
        onSelect={ageGroupField.field.onChange}
        error={errors.Age_Group?.message}
        required
        isOpen={openDropdown === "age-group"}
        onToggle={() => toggleDropdown("age-group")}
      />

      <DropdownField
        label="Kind of payment"
        value={kindField.field.value}
        options={KIND_OF_PAYMENT_OPTIONS}
        onSelect={kindField.field.onChange}
        error={errors.Kind_of_payment?.message}
        required
        isOpen={openDropdown === "kind-of-payment"}
        onToggle={() => toggleDropdown("kind-of-payment")}
      />

      <View className="px-3 py-2 bg-warning/10 border border-warning/30 rounded-md">
        <Text className="text-warning text-supporting">
          For the age group above 60 who do not have health insurance, you can claim deduction up to Rs. 50000 in medical expenses.
        </Text>
      </View>

      <DropdownField
        label="Type of Policy"
        value={typePolicyField.field.value}
        options={TYPE_OF_POLICY_OPTIONS}
        onSelect={typePolicyField.field.onChange}
        error={errors.type_of_policy?.message}
        required
        isOpen={openDropdown === "type-of-policy"}
        onToggle={() => toggleDropdown("type-of-policy")}
      />

      {isMediclaim && (
        <>
          <View>
            <Text className="text-supporting text-textmuted mb-1">
              Name of Insurance company <Text className="text-danger">*</Text>
            </Text>
            <TextInput
              className="border border-border rounded-md px-3 py-2.5 text-body text-textprimary bg-surface"
              placeholder="Name of Insurance company"
              placeholderTextColor="#8a7860"
              value={insuranceCompanyField.field.value}
              onChangeText={insuranceCompanyField.field.onChange}
            />
            {errors.Name_of_Insurance_company && (
              <Text className="text-danger text-supporting mt-1">{errors.Name_of_Insurance_company.message}</Text>
            )}
          </View>

          <View>
            <Text className="text-supporting text-textmuted mb-1">
              Policy number <Text className="text-danger">*</Text>
            </Text>
            <TextInput
              className="border border-border rounded-md px-3 py-2.5 text-body text-textprimary bg-surface"
              placeholder="Policy number"
              placeholderTextColor="#8a7860"
              value={policyNumberField.field.value}
              onChangeText={policyNumberField.field.onChange}
            />
            {errors.Policy_number && (
              <Text className="text-danger text-supporting mt-1">{errors.Policy_number.message}</Text>
            )}
          </View>

          <View>
            <Text className="text-supporting text-textmuted mb-1">
              Premium amount <Text className="text-danger">*</Text>
            </Text>
            <TextInput
              className="border border-border rounded-md px-3 py-2.5 text-body text-textprimary bg-surface"
              placeholder="Premium amount"
              placeholderTextColor="#8a7860"
              keyboardType="decimal-pad"
              value={premiumAmountField.field.value}
              onChangeText={premiumAmountField.field.onChange}
            />
            {errors.Premium_Amount && (
              <Text className="text-danger text-supporting mt-1">{errors.Premium_Amount.message}</Text>
            )}
          </View>
        </>
      )}

      {!isMediclaim && kindOfPayment !== "" && (
        <View>
          <Text className="text-supporting text-textmuted mb-1">
            Amount <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="border border-border rounded-md px-3 py-2.5 text-body text-textprimary bg-surface"
            placeholder="Amount"
            placeholderTextColor="#8a7860"
            keyboardType="decimal-pad"
            value={amountField.field.value}
            onChangeText={amountField.field.onChange}
          />
          {errors.Amount && (
            <Text className="text-danger text-supporting mt-1">{errors.Amount.message}</Text>
          )}
        </View>
      )}

      <View>
        <Text className="text-supporting text-textmuted mb-1">Note (optional)</Text>
        <TextInput
          className="border border-border rounded-md px-3 py-2.5 text-body text-textprimary bg-surface min-h-[80px]"
          placeholder="Enter note..."
          placeholderTextColor="#8a7860"
          multiline
          maxLength={250}
          value={noteField.field.value}
          onChangeText={noteField.field.onChange}
        />
        <View className="flex-row justify-end mt-1">
          <Text className="text-meta text-textmuted">{noteValue.length}/250</Text>
        </View>
      </View>

      <View>
        <Text className="text-supporting text-textmuted mb-2">Upload your policy document here</Text>
        <TouchableOpacity className="border-2 border-dashed border-border rounded-lg px-4 py-6 items-center justify-center bg-card">
          <Text className="text-primary text-2xl mb-1">{String.fromCharCode(128206)}</Text>
          <Text className="text-body text-textmuted">Tap to upload files</Text>
          <Text className="text-meta text-textmuted mt-1">Multiple files can be uploaded</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
