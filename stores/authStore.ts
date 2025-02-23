// stores/authStore.ts
import { create } from "zustand";

import auth, {
  FirebaseAuthTypes,
  sendPasswordResetEmail,
} from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import errorMessages from "@/firebase/errorMessages";
GoogleSignin.configure({
  webClientId:
    "804166405034-60gj29modojbnnv9vbaj3ii4eguc82sm.apps.googleusercontent.com", ///from firebase console
});

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  signInWithGoogle: () => Promise<void>;
  resetPasswordEmail: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await auth().signInWithEmailAndPassword(email, password);
      ///onauthstatechanged in the root layout will handle setting the user state
    } catch (error: any) {
      set({
        error:
          errorMessages.get(error.code) ||
          "An unexpected error occurred when signing in. Please try again later.",
      });
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      ///onauthstatechanged in the root layout will handle setting the user state
    } catch (error: any) {
      set({
        error:
          errorMessages.get(error.code) ||
          "An unexpected error occurred when signing up. Please try again later.",
      });
    } finally {
      set({ loading: false });
    }
  },

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
      await auth().signInWithCredential(googleCredential);

      ///onauthstatechanged in the root layout will handle setting the user state
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
  resetPasswordEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      console.log("sending password reset email to ", email);

      await sendPasswordResetEmail(auth(), email);
    } catch (error: any) {
      set({
        error:
          errorMessages.get(error.code) ||
          "An unexpected error occurred. Please try again later.",
      });
    } finally {
      set({ loading: false });
    }
  },
  logOut: async () => {
    set({ loading: true, error: null });
    try {
      // Sign out from Firebase (works for all auth methods)
      GoogleSignin.revokeAccess(); ///forgets the user so next time user clicks on sign in, he is shown the user selection screen instead of automatically signing in with previous user
      await auth().signOut();
      ///onauthstatechanged in the root layout will handle setting the user state
    } catch (error: any) {
      set({
        error:
          errorMessages.get(error.code) ||
          "An unexpected error occurred when signing out. Please try again later.",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
