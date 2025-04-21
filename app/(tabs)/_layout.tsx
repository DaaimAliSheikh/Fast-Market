import { Redirect, Tabs } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import LoadingPage from "@/components/LoadingPage";
import { Home, MessageCircle, Plus, User } from "lucide-react-native";
import { usePathname } from "expo-router";

export default function AppLayout() {
  const { user, loading } = useAuthStore();
  const pathname = usePathname();
  const isChatScreen = pathname === "/chat";
  console.log(pathname);
  if (loading) return <LoadingPage />;
  else if (!user) return <Redirect href="/(auth)/login" />;
  else
    return (
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: 60,
            paddingTop: 3,
            display: isChatScreen ? "none" : "flex",
          }, // Adjust the height as needed
          headerStyle: {
            backgroundColor: "transparent",
            height: 60,
          },
          headerShadowVisible: false,
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
            popToTopOnBlur: true,
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
