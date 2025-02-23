import { Redirect, Slot } from "expo-router";
import { useAuthStore } from "../../stores/authStore";

export default function AppLayout() {
  const { user } = useAuthStore();
  console.log("app rerender");
  if (!user) return <Redirect href="/(auth)/login" />;
  //render index which redirects to dashboard
  else return <Slot />;
}
