// stores/authStore.ts
import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { auth } from "../firebase/config";
import errorMessages from "@/firebase/errorMessages";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    "804166405034-60gj29modojbnnv9vbaj3ii4eguc82sm.apps.googleusercontent.com", // Get this from Firebase Console
  offlineAccess: true,
});

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<User>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user });
    } catch (error: any) {
      set({
        error:
          errorMessages.get(error.code) ||
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  logOut: async () => {
    try {
      // Check if user signed in with Google
      const user = get().user;
      if (
        user &&
        user.providerData.some(
          (provider) => provider.providerId === "google.com"
        )
      ) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      // Sign out from Firebase (works for all auth methods)
      await auth.signOut();
    } catch (error: any) {
      throw new Error("Error signing out: " + error.message);
    }
  },
  setUser: (user) => set({ user }),
  signInWithGoogle: async () => {
    // Implement Google sign-in logic here
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices();

      // Get user ID token
      const { data } = await GoogleSignin.signIn();
      if (!data) throw new Error("Could not get user");
      const { idToken } = data;
      // Create a Google credential with the token
      const credential = GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase with the Google credential
      const result = await signInWithCredential(auth, credential);

      return result.user;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error("Sign in is already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error("Play services not available");
      } else {
        throw new Error("Something went wrong: " + error.message);
      }
    }
  },
}));
