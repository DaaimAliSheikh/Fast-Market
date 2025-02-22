import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Slot } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import "@/global.css";

export default function RootLayout() {
  const { setUser } = useAuthStore();

  // This listener automatically checks token validity with Firebase, on mount
  // If token expired/invalid, user will be set to null
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GluestackUIProvider  mode="dark">
      <Slot />
    </GluestackUIProvider>
  );
}
