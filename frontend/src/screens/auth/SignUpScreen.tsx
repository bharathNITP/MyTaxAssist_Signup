import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { authStore } from "../../stores/authStore";

const schema = yup.object({
  email: yup.string().required("Email is required").email("Enter a valid email"),
  password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: yup.string().required("Please confirm your password").oneOf([yup.ref("password")], "Passwords do not match"),
});

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text className="text-lg text-textmuted">{visible ? "👁" : "👁‍🗨"}</Text>
);

const ChatBubbleIcon = () => (
  <View className="h-14 w-14 items-center justify-center rounded-full bg-info">
    <Text className="text-2xl text-white">💬</Text>
  </View>
);

export default function SignUpScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768 && Platform.OS === "web";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = useCallback(async (data: { email: string; password: string; confirmPassword: string }) => {
    setGeneralError(null);
    await authStore.getState().signUp(data.email, data.password);
    const state = authStore.getState();
    if (state.error) { setGeneralError(state.error); }
    else if (state.user) { router.replace("/(staff)/dashboard"); }
  }, [router]);

  const handleGoogleSignUp = useCallback(async () => {
    setGeneralError(null);
    await authStore.getState().signInWithGoogle();
    const state = authStore.getState();
    if (state.error) { setGeneralError(state.error); }
    else if (state.user) { router.replace("/(staff)/dashboard"); }
  }, [router]);

  const formPanel = (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} keyboardShouldPersistTaps="handled">
      <View className="px-6 py-8 md:px-12 md:py-12" style={{ maxWidth: 480, width: "100%" }}>
        <View className="mb-6 items-center"><ChatBubbleIcon /></View>

        <Text className="mb-1 text-center text-2xl font-bold text-textprimary">Nice to see you!</Text>
        <Text className="mb-6 text-center text-sm text-textsecondary">Sign up with your email</Text>

        {generalError ? (
          <View className="mb-4 rounded-lg bg-danger/10 p-3">
            <Text className="text-sm text-danger">{generalError}</Text>
          </View>
        ) : null}

        <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Sign up with your Email" placeholder="Email" required keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} />
        )} />

        <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Create Password" placeholder="Password" required secureTextEntry={!showPassword} autoCapitalize="none" autoComplete="new-password" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} rightIcon={<EyeIcon visible={showPassword} />} onRightIconPress={() => setShowPassword((p) => !p)} />
        )} />

        <Controller control={control} name="confirmPassword" render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Re enter Password" placeholder="Confirm Password" required secureTextEntry={!showConfirmPassword} autoCapitalize="none" autoComplete="new-password" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.confirmPassword?.message} rightIcon={<EyeIcon visible={showConfirmPassword} />} onRightIconPress={() => setShowConfirmPassword((p) => !p)} />
        )} />

        <Button title="Continue" onPress={handleSubmit(onSubmit)} loading={isSubmitting} className="mb-4 mt-2" />

        <Text className="mb-6 text-center text-xs text-textmuted">
          By continuing you agree to our <Text className="text-info underline">Terms and Conditions</Text> and <Text className="text-info underline">Privacy Policy</Text>.
        </Text>

        <Button title="Sign up with Google" onPress={handleGoogleSignUp} variant="google" className="mb-6" />

        <Text className="text-center text-sm text-textsecondary">
          Existing member? <Text className="text-info underline" onPress={() => router.push("/(auth)/login")}>Sign In here</Text>
        </Text>

        <TouchableOpacity className="mt-4 items-center" onPress={() => {}}>
          <Text className="text-sm font-bold text-warning underline">Click Here to view guidelines to use this app</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (isDesktop) {
    return (
      <View className="flex-1 flex-row">
        <View className="flex-1 items-center justify-center bg-info/10">
          <View className="items-center px-8">
            <Text className="mb-4 text-center text-3xl font-bold text-textprimary">Pankaj Dharamshi and Co.</Text>
            <Text className="text-center text-base text-textsecondary">Your trusted tax partner</Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center bg-surface">{formPanel}</View>
      </View>
    );
  }

  return <View className="flex-1 bg-surface">{formPanel}</View>;
}
