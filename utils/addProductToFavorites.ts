import firestore from "@react-native-firebase/firestore";

const addProductToFavorites = async (productId: string, userId: string) => {
  if (!userId) {
    console.error("User ID is not available.");
    return;
  }
  try {
    await firestore()
      .collection("users")
      .doc(userId)
      .update({
        favoriteProductIds: firestore.FieldValue.arrayUnion(productId),
      });
    console.log("Product added to favorites.");
  } catch (error) {
    console.error("Error adding product to favorites:", error);
  }
};

export default addProductToFavorites;
