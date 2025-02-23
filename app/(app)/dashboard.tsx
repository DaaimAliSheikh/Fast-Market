import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

const Dashboard = () => {
  const router = useRouter();
  const { logOut, user } = useAuthStore();
  return (
    <View>
      <Text>Dashboard</Text>
      <Avatar size="md">
        <AvatarFallbackText>{user?.displayName?.charAt(0)}</AvatarFallbackText>
        <AvatarImage
          source={{
            uri: user?.photoURL || "",
          }}
        />
      </Avatar>
      <TouchableOpacity
        className="w-full max-w-xs p-3 mt-3 border border-gray-300 rounded items-center"
        onPress={() => router.push("/(public)/home")}
      >
        <Text className="text-gray-700">Go to home page</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-full max-w-xs p-3 mt-3 border border-gray-300 rounded items-center"
        onPress={async () => {
          await logOut();
        }}
      >
        <Text className="text-gray-700">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;
