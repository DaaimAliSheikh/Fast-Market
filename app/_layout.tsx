import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "@/global.css";
import { StatusBar } from "react-native";
import firestore from "@react-native-firebase/firestore";

export default function RootLayout() {
  const { setUser } = useAuthStore();

  // This listener automatically checks token validity with Firebase, on mount
  // If token expired/invalid, user will be set to null

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (!user) {
        setUser(null);
        return;
      }
      const querySnapshot = await firestore()
        .collection("users")
        .where("uid", "==", user.uid)
        .get();
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      setUser({
        ...user,
        favoriteProductIds: userData?.favoriteProductIds || ([] as string[]),
      });
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <GluestackUIProvider mode="system">
      {/* Apply StatusBar globally */}
      <StatusBar className="bg-background-50" barStyle={"light-content"} />
      {/* ScrollViews take up available space even without flex-1 */}
      <SafeAreaProvider>
        {/* Now wrap each screen component with { SafeAreaView } from 'react-native-safe-area-context' and give it flex-1 to take up available space */}
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signin" options={{ headerShown: false }} /> */}
        </Stack>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
