import { Redirect, Slot } from "expo-router";
import { useAuthStore } from "../../stores/authStore";

export default function AppLayout() {
  const { user } = useAuthStore();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  //render index which redirects to dashboard
  return <Slot />;
}
