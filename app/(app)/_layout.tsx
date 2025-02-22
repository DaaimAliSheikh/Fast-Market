import { Redirect, Slot } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import LoadingPage from "@/components/LoadingPage";

export default function AppLayout() {
  const { user, loading } = useAuthStore();

  if (loading) return <LoadingPage />;
  else if (!user) return <Redirect href="/(auth)/login" />;
  //render index which redirects to dashboard
  else return <Slot />;
}
