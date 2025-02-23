import React, { useEffect, useState } from "react";
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

import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Image, Keyboard, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import GoogleIcon from "./icons/google";
import {
  SignUpFormDataSchema,
  SignUpFormDataType,
} from "@/schemas/SignUpFormData";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { Divider } from "@/components/ui/divider";
import LoadingPage from "@/components/LoadingPage";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";

export default function () {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormDataType>({
    resolver: zodResolver(SignUpFormDataSchema),
  });
  const { signUp, signInWithGoogle, loading } = useAuthStore();

  const onSubmit = async (data: SignUpFormDataType) => {
    const { email, password, confirmpassword } = data;
    if (password !== confirmpassword) {
      setError(
        "password",
        { message: "Passwords do not match" },
        { shouldFocus: true }
      );
      setError(
        "confirmpassword",
        { message: "Passwords do not match" },
        { shouldFocus: true }
      );
    } else {
      const error = await signUp(email, password);
      if (error === "auth/email-already-in-use")
        setError(
          "email",
          {
            message:
              "This email address is already associated with another account.",
          },
          { shouldFocus: true }
        );
      else
        setError("password", {
          message:
            "An unexpected error occurred when signing in. Please try again later.",
        });
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const handleConfirmPwState = () => {
    setShowConfirmPassword((showState) => {
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
      <ScrollView>
        <VStack
          className="max-w-[440px] items p-4 px-8  h-full w-full "
          space="md"
        >
          <HStack
            space="md"
            className="md:text-center mx-auto items-center mt-8"
          >
            <Image
              className="h-20 w-20 "
              source={require("../../assets/FAST-LOGO.png")}
            />
            <VStack>
              <Heading size="3xl" className="">
                FAST
              </Heading>
              <Heading size="3xl" className=" font-light">
                MARKET
              </Heading>
            </VStack>
          </HStack>

          <VStack className="md:items-center mt-4" space="md">
            <VStack>
              <Heading className="md:text-center  mb-4" size="2xl">
                Sign up
              </Heading>
              <Text>Sign up and start listing your products</Text>
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
              <FormControl isInvalid={!!errors.confirmpassword}>
                <FormControlLabel>
                  <FormControlLabelText>Confirm Password</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  defaultValue=""
                  name="confirmpassword"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Confirm Password"
                        className="text-sm"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                        returnKeyType="done"
                        type={showConfirmPassword ? "text" : "password"}
                      />

                      <InputSlot
                        onPress={handleConfirmPwState}
                        className="pr-3"
                      >
                        <InputIcon
                          as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                        />
                      </InputSlot>
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon size="sm" as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.confirmpassword?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>

            <VStack className="w-full my-7" space="lg">
              <Button
                className="w-full bg-primary-500"
                onPress={handleSubmit(onSubmit)}
              >
                <ButtonText className="font-medium text-typography-900">
                  Sign up
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
                          <Toast nativeID={id} variant="solid" action={"error"}>
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
            <HStack className="self-center" space="sm">
              <Text size="md">Already have an account?</Text>
              <Link onPress={() => router.push("/(auth)/login")}>
                <LinkText
                  className="font-medium text-typography-500 group-hover/link:text-primary-600 group-hover/pressed:text-primary-700"
                  size="md"
                >
                  Login
                </LinkText>
              </Link>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    );
}
