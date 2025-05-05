import Product from "@/types/Product";
import firestore from "@react-native-firebase/firestore";

export async function addProductToFirestore(
  product: Omit<Product, "id">
): Promise<void> {
  const productRef = firestore().collection("products").doc();

  await productRef.set({
    ...product,
    id: productRef.id,
  });
}
