import React from "react";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

import { Button, ButtonText } from "@/components/ui/button";
import { Image, Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import {
  ForgotPasswordDataSchema,
  ForgotPasswordDataType,
} from "@/schemas/ForgotPasswordData";
import { useAuthStore } from "@/stores/authStore";
import { LinkText, Link } from "@/components/ui/link";
import { router } from "expo-router";
import LoadingPage from "@/components/LoadingPage";
import { ScrollView } from "react-native";
import GradientText from "@/components/ui/gradient-text";
import { TouchableWithoutFeedback } from "react-native";

export default function () {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordDataType>({
    resolver: zodResolver(ForgotPasswordDataSchema),
  });
  const toast = useToast();
  const { resetPasswordEmail, loading } = useAuthStore();

  const onSubmit = async (data: ForgotPasswordDataType) => {
    const { email } = data;
    const error = await resetPasswordEmail(email);
    toast.show({
      placement: "bottom right",
      render: ({ id }) => {
        return (
          <Toast
            nativeID={id}
            variant="solid"
            action={error ? "error" : "success"}
          >
            <ToastTitle>{error || "Link Sent Successfully"}</ToastTitle>
          </Toast>
        );
      },
    });

    reset();
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };
  if (loading) return <LoadingPage />;
  else
    return (
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <ScrollView>
          <VStack
            className="max-w-[440px] items p-4 px-8  h-full w-full"
            space="md"
          >
            <HStack
              space="md"
              className="md:text-center mx-auto items-center mt-16"
            >
              <Image
                className="h-20 w-20 "
                source={require("../../assets/FAST-LOGO.png")}
              />
              <VStack>
                <GradientText
                  text="FAST"
                  colors={["#4c669f", "#3b5998", "#192f6a"]}
                  maskedViewHeight={50}
                />
                <Heading size="3xl" className=" font-light">
                  MARKET
                </Heading>
              </VStack>
            </HStack>
            <Heading className=" color-primary-300 mx-auto mb-16" size="sm">
              The Marketplace for Fastians
            </Heading>

            <VStack className="md:items-center mt-4" space="md">
              <VStack>
                <Heading className="md:text-center  mb-4" size="2xl">
                  Forgot Password?
                </Heading>
                <Text> Enter email ID associated with your account.</Text>
              </VStack>
            </VStack>
            <VStack className="w-full">
              <VStack space="xl" className="w-full">
                <FormControl isInvalid={!!errors.email}>
                  <FormControlLabel>
                    <FormControlLabelText>Email</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    name="email"
                    defaultValue=""
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          className="text-sm"
                          placeholder="Email"
                          type="text"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          onSubmitEditing={handleKeyPress}
                          returnKeyType="done"
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorIcon size="md" as={AlertTriangle} />
                    <FormControlErrorText>
                      {errors?.email?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </VStack>
              <Button
                className="w-full bg-primary-500 my-6"
                onPress={() => handleSubmit(onSubmit)()}
              >
                <ButtonText className="font-medium">
                  Send password reset link
                </ButtonText>
              </Button>
              <Link
                className="mx-auto"
                onPress={() => router.push("/(auth)/login")}
              >
                <LinkText
                  className="font-medium text-typography-500 group-hover/link:text-primary-600 group-hover/pressed:text-primary-700"
                  size="md"
                >
                  Back to Sign In
                </LinkText>
              </Link>
            </VStack>
          </VStack>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
}
