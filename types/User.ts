interface User {
  ///this type represents the user info stored in the users collection in firestore
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  favoriteProductIds: string[];
}

export default User;
