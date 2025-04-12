import { View, Text } from "react-native";
import React from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

const profile = () => {
  const { logOut } = useAuthStore();

  return (
    <View>
      <Text>profile</Text>
      <Button onPress={async () => await logOut()}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </View>
  );
};

export default profile;
