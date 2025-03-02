import React, { useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Link, LinkText } from "@/components/ui/link";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import GradientText from "@/components/ui/gradient-text";

import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Image, Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import GoogleIcon from "./icons/google";
import {
  SignInFormDataSchema,
  SignInFormDataType,
} from "@/schemas/SignInFormData";
import { useAuthStore } from "@/stores/authStore";
import { Divider } from "@/components/ui/divider";
import LoadingPage from "@/components/LoadingPage";
import { ScrollView } from "react-native";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormDataType>({
    resolver: zodResolver(SignInFormDataSchema),
  });
  const { signIn, signInWithGoogle, loading } = useAuthStore();
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: SignInFormDataType) => {
    const { email, password } = data;

    const error = await signIn(email, password);
    console.log(error);
    if (error == "auth/invalid-credential")
      setError(
        "password",
        {
          message:
            "Incorrect password. Please try again or reset your password.",
        },
        { shouldFocus: true }
      );
    else
      setError("password", {
        message:
          "An unexpected error occurred when signing in. Please try again later.",
      });
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  if (loading) return <LoadingPage />;
  else
    return (
      <SafeAreaView className="flex-1">
        <ScrollView>
          <VStack className="max-w-[440px]  p-4 px-8  " space="md">
            <HStack
              space="md"
              className="md:text-center mx-auto items-center mt-8"
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
            <Heading className=" color-primary-300 mx-auto" size="sm">
              The Marketplace for Fastians
            </Heading>
            <VStack className="md:items-center mt-4" space="md">
              <VStack>
                <Heading className="md:text-center  mb-4" size="2xl">
                  Sign In
                </Heading>
                <Text>Sign in and start listing your products</Text>
              </VStack>
            </VStack>
            <VStack className="w-full ">
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
                <FormControl isInvalid={!!errors.password}>
                  <FormControlLabel>
                    <FormControlLabelText>Password</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    defaultValue=""
                    name="password"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          className="text-sm"
                          placeholder="Password"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          onSubmitEditing={handleKeyPress}
                          returnKeyType="done"
                          type={showPassword ? "text" : "password"}
                        />
                        <InputSlot onPress={handleState} className="pr-3">
                          <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                        </InputSlot>
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorIcon size="sm" as={AlertTriangle} />
                    <FormControlErrorText>
                      {errors?.password?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </VStack>

              <VStack className="w-full gap-6 mt-4" space="lg">
                <Link onPress={() => router.push("/(auth)/forgot-password")}>
                  <LinkText className="font-medium text-sm text-primary-700 group-hover/link:text-primary-600">
                    Forgot Password?
                  </LinkText>
                </Link>
                <Button
                  className="w-full bg-primary-500"
                  onPress={handleSubmit(onSubmit)}
                >
                  <ButtonText className="font-medium text-typography-900">
                    Sign In
                  </ButtonText>
                </Button>
                <HStack className="self-center items-center " space="md">
                  <Divider />
                  <Text>or</Text>
                  <Divider />
                </HStack>

                <Button
                  variant="outline"
                  className="w-full gap-1"
                  onPress={async () => {
                    const error = await signInWithGoogle();

                    error &&
                      toast.show({
                        placement: "bottom right",
                        render: ({ id }) => {
                          return (
                            <Toast
                              nativeID={id}
                              variant="solid"
                              action={"error"}
                            >
                              <ToastTitle>{error}</ToastTitle>
                            </Toast>
                          );
                        },
                      });
                  }}
                >
                  <ButtonText className="font-medium">
                    Continue with Google
                  </ButtonText>
                  <ButtonIcon as={GoogleIcon} />
                </Button>
              </VStack>
              <HStack className="self-center my-6" space="sm">
                <Text size="md">Don't have an account?</Text>
                <Link onPress={() => router.replace("/(auth)/signup")}>
                  <LinkText className="font-medium " size="md">
                    Sign up
                  </LinkText>
                </Link>
              </HStack>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
}
