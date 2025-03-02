import { useAuthStore } from "@/stores/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { user } = useAuthStore();

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
