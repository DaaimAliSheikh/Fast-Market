import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, error, loading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    await signIn(email, password);
    if (!error) {
      router.replace("/dashboard");
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-2xl mb-4">Login</Text>
      <View className="w-full max-w-xs mb-3">
        <Text className="mb-1 text-gray-700">Email</Text>
        <TextInput
          className="w-full p-3 border border-gray-300 rounded"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View className="w-full max-w-xs mb-3">
        <Text className="mb-1 text-gray-700">Password</Text>
        <TextInput
          className="w-full p-3 border border-gray-300 rounded"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
      {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
      <TouchableOpacity
        className={`w-full max-w-xs p-3 bg-blue-500 rounded items-center ${
          loading ? "opacity-50" : ""
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white">Login</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator className="mt-3" />}
      <TouchableOpacity
        className="w-full max-w-xs p-3 mt-3 border border-gray-300 rounded items-center"
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text className="text-gray-700">Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}
