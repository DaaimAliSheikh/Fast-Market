import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Slot } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import "@/global.css";

export default function RootLayout() {
  const { setUser } = useAuthStore();

  // This listener automatically checks token validity with Firebase, on mount
  // If token expired/invalid, user will be set to null

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <GluestackUIProvider mode="dark">
      
      <Slot />
    </GluestackUIProvider>
  );
}
