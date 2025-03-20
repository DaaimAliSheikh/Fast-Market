import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="chatList" options={{ title: "Chats" }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
    </Stack>
  );
}
