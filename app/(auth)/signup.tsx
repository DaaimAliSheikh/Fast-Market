import React, { useState } from "react";
import { Text } from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignUpFormDataSchema,
  SignUpFormDataType,
} from "@/schemas/SignUpFormData";
import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

export default function SignupScreen() {
  const { signUp, error, loading } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (data: SignUpFormDataType) => {
    const { email, password } = data;
    await signUp(email, password);
    if (!error) {
      router.replace("/dashboard");
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormDataType>({
    resolver: zodResolver(SignUpFormDataSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <VStack space="md">
        <Text className="text-2xl font-bold text-center mb-6 bg-red-500">
          Create Account
        </Text>

        <FormControl isInvalid={!!errors.email}>
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input>
                <InputField
                  value={value}
                  onChangeText={onChange}
                  className="p-2 border rounded-lg"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
            )}
          />
          {errors.email && (
            <FormControlError>
              <FormControlErrorText>
                {errors.email.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input>
                <InputField
                  value={value}
                  onChangeText={onChange}
                  className="p-2 border rounded-lg"
                  placeholder="Enter your password"
                  secureTextEntry
                />
              </Input>
            )}
          />
          {errors.password && (
            <FormControlError>
              <FormControlErrorText>
                {errors.password.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormControlLabel>
            <FormControlLabelText>Confirm Password</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input>
                <InputField
                  value={value}
                  onChangeText={onChange}
                  className="p-2 border rounded-lg"
                  placeholder="Confirm your password"
                  secureTextEntry
                />
              </Input>
            )}
          />
          {errors.confirmPassword && (
            <FormControlError>
              <FormControlErrorText>
                {errors.confirmPassword.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Button
          className="mt-6 bg-blue-600 rounded-lg"
          onPress={handleSubmit(onSubmit)}
        >
          <ButtonText className="text-white font-semibold">Sign Up</ButtonText>
        </Button>

        <Button
          variant="link"
          className="mt-4"
          onPress={() => router.push("/login")}
        >
          <ButtonText className="text-blue-600">
            Already have an account? Login
          </ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
