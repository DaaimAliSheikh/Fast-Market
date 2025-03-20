import { Redirect, Tabs } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import LoadingPage from "@/components/LoadingPage";

export default function AppLayout() {
  const { user, loading } = useAuthStore();
  if (loading) return <LoadingPage />;
  else if (!user) return <Redirect href="/(auth)/login" />;
  //render index which redirects to dashboard
  else
    return (
      <Tabs
        screenOptions={{
          tabBarStyle: { height: 60, paddingTop: 3 }, // Adjust the height as needed
          tabBarHideOnKeyboard: true,
          animation: "shift",
        }}
      >
        {/* order matters of tab screens, top one is rendered first */}
        <Tabs.Screen name="home" options={{ title: "Home", tabBarBadge: 1 }} />
        <Tabs.Screen
          name="createListing"
          options={{ title: "Add", tabBarBadge: 1 }}
        />

        <Tabs.Screen
          name="(chats)"
          options={{ title: "Chats", headerShown: false }}
        />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />

        {/* <Tabs.Screen options={{ title: "Home Tab" }} /> */}
      </Tabs>
    );
}
