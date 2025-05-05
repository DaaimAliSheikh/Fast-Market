import firestore from "@react-native-firebase/firestore";

interface DeleteProductResult {
  success: boolean;
  error?: string;
}

export async function deleteProductAndChats(
  productId: string
): Promise<DeleteProductResult> {
  const productRef = firestore().collection("products").doc(productId);
  const chatQuery = firestore()
    .collection("chats")
    .where("selectedProductId", "==", productId);
  const usersQuery = firestore()
    .collection("users")
    .where("favoriteProductIds", "array-contains", productId);

  try {
    // Step 1: Delete the product
    await productRef.delete();
    console.log(`Product ${productId} deleted.`);

    // Step 2: Find and delete related chats and their messages
    const chatSnapshot = await chatQuery.get();
    const batch = firestore().batch();

    for (const chatDoc of chatSnapshot.docs) {
      // Delete messages subcollection
      const messagesRef = chatDoc.ref.collection("messages");
      const messagesSnapshot = await messagesRef.get();
      messagesSnapshot.forEach((messageDoc) => {
        batch.delete(messageDoc.ref);
      });

      // Delete chat document
      batch.delete(chatDoc.ref);
    }

    // Step 3: Remove productId from users' favoriteProductIds
    const usersSnapshot = await usersQuery.get();
    usersSnapshot.forEach((userDoc) => {
      batch.update(userDoc.ref, {
        favoriteProductIds: firestore.FieldValue.arrayRemove(productId),
      });
    });

    // Commit all deletions and updates in a single batch
    await batch.commit();
    console.log(`Deleted ${chatSnapshot.size} related chats.`);
    console.log(
      `Removed product ${productId} from ${usersSnapshot.size} users' favorites.`
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting product, chats, and favorites:", error);
    return { success: false, error: (error as Error).message };
  }
}

export default deleteProductAndChats;
