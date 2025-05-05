import firestore from "@react-native-firebase/firestore";

/**
 * Toggles a product in user's favorites - adds if not in favorites, removes if already in favorites
 * @param {string} productId - ID of the product to toggle
 * @param {string} userId - ID of the current user
 * @returns {Promise<boolean>} - Returns true if product was added, false if removed
 */
const toggleProductFavorite = async (
  productId: string,
  userId: string
): Promise<boolean> => {
  if (!userId) {
    console.error("User ID is not available.");
    throw new Error("User ID is required");
  }

  try {
    // Get the current user document to check if product is already in favorites
    const userDoc = await firestore().collection("users").doc(userId).get();

    if (!userDoc.exists) {
      console.error("User document not found");
      throw new Error("User document not found");
    }

    const userData = userDoc.data();
    const favoriteProductIds = userData?.favoriteProductIds || [];

    // Check if the product is already in favorites
    const isAlreadyFavorite = favoriteProductIds.includes(productId);

    if (isAlreadyFavorite) {
      // Remove from favorites
      await firestore()
        .collection("users")
        .doc(userId)
        .update({
          favoriteProductIds: firestore.FieldValue.arrayRemove(productId),
        });
      console.log("Product removed from favorites.");
      return false; // Indicates product was removed
    } else {
      // Add to favorites
      await firestore()
        .collection("users")
        .doc(userId)
        .update({
          favoriteProductIds: firestore.FieldValue.arrayUnion(productId),
        });
      console.log("Product added to favorites.");
      return true; // Indicates product was added
    }
  } catch (error) {
    console.error("Error toggling product favorite status:", error);
    throw error;
  }
};

export default toggleProductFavorite;
