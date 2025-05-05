import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { AddIcon, Icon } from "@/components/ui/icon";
import { AnimatePresence, Motion } from "@legendapp/motion";
import { FlatList, Pressable } from "react-native";

import { Ban, Heart, Trash } from "lucide-react-native";
import Product from "@/types/Product";
import { TouchableOpacity } from "react-native";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import addProductToFavorites from "@/utils/addProductToFavorites";
import { useAuthStore } from "@/stores/authStore";
import { Box } from "./ui/box";
import HighlightText from "@/utils/HighlightText";
import deleteProductAndChats from "@/utils/deleteProductAndChats";
import { deleteImageFromCloudinary } from "@/utils/deleteImageFromCloudinary";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

// Tab Panel with Search Filtering
const TabPanelData = ({
  activeCategory,
  searchQuery,
  setShowActionsheet,
  setSelectedProduct,
  products,
  likes,
  setLikes,
  refreshing,
  onRefresh,
}: {
  activeCategory: string;
  searchQuery: string;
  setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  products: Product[];
  likes: string[];
  setLikes: React.Dispatch<React.SetStateAction<string[]>>;
  refreshing: boolean;
  onRefresh: () => void;
}) => {
  const filteredData = products.filter(
    (product) =>
      product.category.toLowerCase() === activeCategory.toLowerCase() &&
      (product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const { user } = useAuthStore();
  const [deleting, setDeleting] = useState(false);

  const renderItem = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      className="w-full px-4 my-4"
      activeOpacity={0.6}
      onPress={() => {
        setSelectedProduct(product);
        setShowActionsheet(true);
      }}
    >
      <Box className="overflow-hidden rounded-md h-72 flex justify-center items-center">
        {product.image ? (
          <Image
            source={String(product.image)}
            className="w-full contain h-72"
            alt="product image"
          />
        ) : (
          <>
            <Icon as={Ban} size="xl" />
            <Text>No Image</Text>
          </>
        )}
      </Box>

      <HStack className="justify-between py-2 items-start">
        <VStack space="sm" className="flex-1">
          <HighlightText
            text={product.title}
            highlight={searchQuery}
            numberOfLines={1}
          />
          <HighlightText
            text={product.description}
            highlight={searchQuery}
            numberOfLines={2}
          />
          <HStack>
            <Text size="sm" className="font-semibold text-typography-900">
              {"PKR " + product.price}
            </Text>
          </HStack>
        </VStack>
        <Pressable
          onPress={async () => {
            if (products[0].sellerId === user?.uid) {
              setDeleting(true);
              if (product.image)
                await deleteImageFromCloudinary(product.image || "");
              await deleteProductAndChats(product.id);
              setDeleting(false);
              alert("Product deleted successfully!");
              await onRefresh();
              return;
            }

            if (likes.includes(product.id)) {
              setLikes((prev) => prev.filter((like) => like !== product.id));
            } else {
              setLikes((prev) => [...prev, product.id]);
            }
            await addProductToFavorites(product.id, user?.uid || "");
          }}
          className="absolute top-3 right-4 h-6 w-6 justify-center items-center"
        >
          {deleting ? (
            <Spinner size={"small"} />
          ) : products[0].sellerId === user?.uid ? (
            <Icon as={Trash} size="xl" color="red" />
          ) : (
            <AnimatePresence>
              <Motion.View
                key={likes.includes(product.id) ? "liked" : "unliked"}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  mass: 0.9,
                  damping: 9,
                  stiffness: 300,
                }}
                style={{ position: "absolute" }}
              >
                <Icon
                  as={Heart}
                  size="lg"
                  className={`${
                    likes.includes(product.id)
                      ? "fill-red-500 stroke-red-500"
                      : "fill-gray-500 stroke-white"
                  }`}
                />
              </Motion.View>
            </AnimatePresence>
          )}
        </Pressable>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={filteredData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        !refreshing ? (
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            No items found.
          </Text>
        ) : null
      }
    />
  );
};
export default TabPanelData;
