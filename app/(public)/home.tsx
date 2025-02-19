import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuthStore } from "@/stores/authStore";

const Home = () => {
  const { logOut } = useAuthStore();
  return (
    <View>
      <Text>Home</Text>
      <TouchableOpacity className="w-full max-w-xs p-3 mt-3 border border-gray-300 rounded items-center">
        <Text
          className="text-gray-700"
          onPress={async () => {
            await logOut();
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
