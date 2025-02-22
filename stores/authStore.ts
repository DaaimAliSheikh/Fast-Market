// stores/authStore.ts
import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { auth as configAuth } from "../firebase/config";
import errorMessages from "@/firebase/errorMessages";
GoogleSignin.configure({
  webClientId:
    "804166405034-60gj29modojbnnv9vbaj3ii4eguc82sm.apps.googleusercontent.com", ///from firebase console
});

interface AuthState {
  user: User | FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        configAuth,
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
        configAuth,
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
    set({ loading: true, error: null });
    try {
      // Sign out from Firebase (works for all auth methods)
      await configAuth.signOut();
      set({ user: null });
    } catch (error: any) {
      set({ error: "Error signing out: " + error.message });
    } finally {
      set({ loading: false });
    }
  },
  setUser: (user) => set({ user }),
  signInWithGoogle: async () => {
    // Implement Google sign-in logic here
    set({ loading: true, error: null });
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;

      if (!idToken) {
        set({ error: "could not get user" });
        return;
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      // Sign-in the user with the credential
      set({ user: userCredential.user });
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        set({ error: "User cancelled the login flow" });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        set({ error: "Sign in is already in progress" });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        set({ error: "Play services not available" });
      } else {
        set({ error: "Something went wrong: " + error.message });
      }
    } finally {
      set({ loading: false });
    }
  },
}));
