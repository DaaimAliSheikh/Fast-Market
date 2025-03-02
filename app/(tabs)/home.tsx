import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  const { logOut } = useAuthStore();
  return (
    <View>
      <Text>Home page</Text>
      <Button onPress={async () => await logOut()}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </View>
  );
};

export default Index;
