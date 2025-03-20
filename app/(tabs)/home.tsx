import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import React from "react";
import { Keyboard, Text, View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { TouchableWithoutFeedback } from "react-native";

const Home = () => {
  const { logOut } = useAuthStore();
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View className="flex-1">
        <Text>Home page</Text>
        <Button onPress={async () => await logOut()}>
          <ButtonText>Logout</ButtonText>
        </Button>
        <Input
          className="mt-6"
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField placeholder="Enter Text here..." />
        </Input>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
