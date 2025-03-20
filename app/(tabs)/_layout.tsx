import { Redirect, Tabs } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import LoadingPage from "@/components/LoadingPage";
import { Home, MessageCircle, Plus, User } from "lucide-react-native";

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
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="createListing"
          options={{
            title: "Add Listing",
            tabBarIcon: ({ color }) => <Plus color={color} />,
          }}
        />

        <Tabs.Screen
          name="(chats)"
          options={{
            title: "Chats",
            headerShown: false,
            tabBarIcon: ({ color }) => <MessageCircle color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <User color={color} />,
          }}
        />
      </Tabs>
    );
}
