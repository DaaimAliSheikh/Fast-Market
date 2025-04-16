import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";

import firestore from "@react-native-firebase/firestore";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import ModalContent from "@/components/ModalContent";
import Product from "@/types/Product";
import { useAuthStore } from "@/stores/authStore";
import TabPanelData from "@/components/TabPanelData";
import TabPanel from "@/components/TabPanel";
// Tabs Component

// Homestay Section with Tabs and Panel
const ProductsList = ({ searchQuery }: any) => {
  const [activeCategory, setActiveCategory] = React.useState<string>("abc");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [likes, setLikes] = React.useState<string[]>([]); ///id of products liked
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useAuthStore();

  const fetchProducts = async () => {
    const snapshot = await firestore().collection("products").get();
    const db_products: Product[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    setProducts(db_products);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };
  useEffect(() => {
    (async () => {
      const snapshot = await firestore().collection("products").get();
      const db_products: Product[] = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      }) as Product[];
      setProducts(db_products);
    })();
  }, []);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];
    setCategories(uniqueCategories);
    (async () => {
      const userDoc = await firestore()
        .collection("users")
        .doc(user?.uid)
        .get();
      if (userDoc.exists) {
        setLikes(userDoc.data()?.favoriteProductIds || []); ///id of products liked
      }
    })();
  }, [products]);

  const handleClose = () => setShowActionsheet(false);
  return (
    <>
      <Box className="px-2 pt-2 border-white-200">
        <TabPanel
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </Box>
      <ScrollView className="px-4 md:px-0 flex-1">
        <TabPanelData
          setShowActionsheet={setShowActionsheet}
          activeCategory={activeCategory}
          products={products}
          setSelectedProduct={setSelectedProduct}
          searchQuery={searchQuery}
          likes={likes}
          setLikes={setLikes}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </ScrollView>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[80]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper className="py-2">
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {selectedProduct && (
            <ModalContent
              selectedProduct={selectedProduct}
              handleClose={handleClose}
              likes={likes}
              setLikes={setLikes}
            />
          )}
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

// Main Home Component
const Home = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View className="flex-1">
      <Input className="rounded-full mx-2 my-2">
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Input>
      <ProductsList searchQuery={searchQuery} />
    </View>
  );
};

export default Home;
