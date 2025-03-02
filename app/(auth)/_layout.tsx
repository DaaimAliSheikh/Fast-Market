import { Redirect, Slot, Stack } from "expo-router";
import { useAuthStore } from "../../stores/authStore";

export default function AppLayout() {
  const { user } = useAuthStore();
  if (user) return <Redirect href="/(tabs)/home" />;
  else
    return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      </Stack>
    );
}
