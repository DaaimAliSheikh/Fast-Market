import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmMn1Tpl02VQxwIzObBl9xnp5reI-MmKo",
  authDomain: "fast-market-99fea.firebaseapp.com",
  projectId: "fast-market-99fea",
  storageBucket: "fast-market-99fea.firebasestorage.app",
  messagingSenderId: "804166405034",
  appId: "1:804166405034:web:b167bcb294e5b07a44f9d3",
  measurementId: "G-LK61LFSL5S",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
