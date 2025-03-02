import { Redirect, Slot, Tabs } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import LoadingPage from "@/components/LoadingPage";

export default function AppLayout() {
  const { user, loading } = useAuthStore();
  if (loading) return <LoadingPage />;
  else if (!user) return <Redirect href="/(auth)/login" />;
  //render index which redirects to dashboard
  else
    return (
      <Tabs>
        {/* order matters of tab screens, top one is rendered first */}
        <Tabs.Screen name="home" options={{ title: "Home Tab" }} />
      </Tabs>
    );
}
