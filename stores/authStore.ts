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
GoogleSignin.configure({
  webClientId:
    "804166405034-60gj29modojbnnv9vbaj3ii4eguc82sm.apps.googleusercontent.com", ///from firebase console
});
import firestore from "@react-native-firebase/firestore";
import User from "@/types/User";

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | undefined>;
  signUp: (
    displayName: string,
    email: string,
    password: string
  ) => Promise<string | undefined>;
  logOut: () => Promise<string | undefined>;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  signInWithGoogle: () => Promise<string | undefined>;
  resetPasswordEmail: (email: string) => Promise<string | undefined>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      set({ user: userCredential.user }); ///setting to user by myself because the onauthstatechanged takes a slight time delay to set it to user

      ///onauthstatechanged in the root layout will handle setting the user state
    } catch (error: any) {
      return error.code;
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (displayName, email, password) => {
    set({ loading: true });
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      await userCredential.user.updateProfile({ displayName });

      // Reload the user to apply the profile updates
      await userCredential.user.reload();

      // Optionally, fetch the updated user
      const updatedUser = auth().currentUser;

      await firestore()
        .collection("users")
        .doc(updatedUser?.uid)
        .set({
          displayName: updatedUser?.displayName,
          email: updatedUser?.email,
          photoURL: updatedUser?.photoURL,
          favoriteProductIds: [] as string[],
        });

      set({ user: updatedUser }); ///setting to user by myself because the onauthstatechanged takes a slight time delay to set it to user

      ///onauthstatechanged in the root layout will handle setting the user state
    } catch (error: any) {
      return error.code;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    // Implement Google sign-in logic here
    set({ loading: true });
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
        return "Sign in cancelled";
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      const user = userCredential.user;
      userCredential.additionalUserInfo?.isNewUser &&
        (await firestore()
          .collection("users")
          .doc(user?.uid)
          .set({
            displayName: user?.displayName,
            email: user?.email,
            photoURL: user?.photoURL,
            favoriteProductIds: [] as string[],
          }));

      set({ user: userCredential.user }); ///setting to user by myself because the onauthstatechanged takes a slight time delay to set it to user

      ///onauthstatechanged in the root layout will handle setting the user state
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return "User cancelled the login flow";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return "Sign in is already in progress";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return "Play services not available";
      } else {
        return "Something went wrong";
      }
    } finally {
      set({ loading: false });
    }
  },
  resetPasswordEmail: async (email: string) => {
    set({ loading: true });
    try {
      console.log("sending password reset email to ", email);

      await sendPasswordResetEmail(auth(), email);
    } catch (error: any) {
      return "An unexpected error occurred. Could not send the password reset email.";
    } finally {
      set({ loading: false });
    }
  },
  logOut: async () => {
    set({ loading: true });
    try {
      // Sign out from Firebase (works for all auth methods)
      GoogleSignin.revokeAccess(); ///forgets the user so next time user clicks on sign in, he is shown the user selection screen instead of automatically signing in with previous user
      await auth().signOut();
      set({ user: null }); ///setting to null by myself because the onauthstatechanged takes a slight time delay to set it to null
      ///onauthstatechanged in the root layout will handle setting the user state
    } catch (error: any) {
      return "An unexpected error occurred when signing out.";
    } finally {
      set({ loading: false });
    }
  },
}));
