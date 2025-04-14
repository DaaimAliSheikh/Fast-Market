import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface User extends FirebaseAuthTypes.User {
  favoriteProductIds: string[];
  // Add other custom fields as needed
}

export default User;
