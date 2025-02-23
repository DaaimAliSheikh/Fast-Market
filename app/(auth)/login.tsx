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
import { router } from "expo-router";
import { Divider } from "@/components/ui/divider";
import LoadingPage from "@/components/LoadingPage";

export default function () {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormDataType>({
    resolver: zodResolver(SignInFormDataSchema),
  });
  const { signIn, signInWithGoogle, error, loading } = useAuthStore();

  const onSubmit = async (data: SignInFormDataType) => {
    const { email, password } = data;

    await signIn(email, password);
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
  useEffect(() => {
    if (error) setError("email", { message: error }, { shouldFocus: true });
  }, [error]);
  if (loading) return <LoadingPage />;
  else
    return (
      <VStack
        className="max-w-[440px] items p-4 px-8  h-full w-full bg-background-50"
        space="md"
      >
        <HStack space="md" className="md:text-center mx-auto items-center mt-8">
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
        <Heading className=" color-primary-300 mx-auto" size="sm">
          The Marketplace for Fastians
        </Heading>
        <VStack className="md:items-center mt-4" space="md">
          <VStack>
            <Heading className="md:text-center  mb-4" size="2xl">
              Sign In
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
              onPress={async () => await signInWithGoogle()}
            >
              <ButtonText className="font-medium">
                Continue with Google
              </ButtonText>
              <ButtonIcon as={GoogleIcon} />
            </Button>
          </VStack>
          <HStack className="self-center my-6" space="sm">
            <Text size="md">Don't have an account?</Text>
            <Link onPress={() => router.push("/(auth)/signup")}>
              <LinkText
                className="font-medium text-primary-700 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
                size="md"
              >
                Sign up
              </LinkText>
            </Link>
          </HStack>
        </VStack>
      </VStack>
    );
}
