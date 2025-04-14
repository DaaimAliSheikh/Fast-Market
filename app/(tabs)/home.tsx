import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon, Heart } from "lucide-react-native";
import { AnimatePresence, Motion } from "@legendapp/motion";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import firestore from "@react-native-firebase/firestore";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { TouchableOpacity } from "react-native";
import HighlightText from "@/utils/HighlightText";
import ModalContent from "@/components/ModalContent";
import Product from "@/types/Product";
// Tabs Component
const HomestayInfoTabs = ({
  categories,
  activeCategory,
  setActiveCategory,
}: any) => {
  return (
    <Box className="border-b border-outline-50  mb-2 md:border-b-0 md:border-transparent">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="lg" className="mx-0.5 xl:gap-5 2xl:gap-6">
          {categories.map((cat: string) => (
            <Pressable
              key={cat}
              className={`my-0.5 p-2 ${
                activeCategory === cat ? "border-b-[3px]" : "border-b-0"
              } border-primary-600 hover:border-b-[3px] ${
                activeCategory === cat
                  ? "hover:border-outline-900"
                  : "hover:border-outline-200"
              }`}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                size="sm"
                className={`${
                  activeCategory === cat
                    ? "text-primary-500"
                    : "text-typography-600"
                } font-medium`}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

// Tab Panel with Search Filtering
const TabPanelData = ({
  activeCategory,
  searchQuery,
  setShowActionsheet,
  setSelectedProduct,
  products,
  likes,
  setLikes,
}: {
  activeCategory: string;
  searchQuery: string;
  setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  products: Product[];
  likes: string[];
  setLikes: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const data: Product[] = products.filter(
    (product) => product.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <VStack className="flex-1">
        {filteredData.map((product: Product, index: number) => (
          <Box
            key={index}
            className={`flex-1 my-4 lg:my-0 ${
              index === 0 ? "lg:ml-0" : "lg:ml-2"
            } ${index === filteredData.length - 1 ? "lg:mr-0" : "lg:mr-2"}`}
          >
            <TouchableOpacity
              className="w-full"
              onPress={() => {
                setSelectedProduct(product);
                setShowActionsheet(true);
              }}
            >
              <Box className="overflow-hidden rounded-md h-72">
                <Image
                  source={product.image || ""}
                  className="w-full contain h-72"
                  alt="product image"
                />
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
                    <Text
                      size="sm"
                      className="font-semibold text-typography-900"
                    >
                      {product.price}
                    </Text>
                  </HStack>
                </VStack>
                <Pressable
                  onPress={() => {
                    if (likes.includes(product.title)) {
                      setLikes((prev) =>
                        prev.filter((like: any) => like !== product.id)
                      );
                    } else {
                      setLikes((prev) => [...prev, product.id]);
                    }
                  }}
                  className="absolute top-3 right-4 h-6 w-6 justify-center items-center"
                >
                  <AnimatePresence>
                    <Motion.View
                      key={likes.includes(product.title) ? "liked" : "unliked"}
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
                          likes.includes(product.title)
                            ? "fill-red-500 stroke-red-500"
                            : "fill-gray-500 stroke-white"
                        }`}
                      />
                    </Motion.View>
                  </AnimatePresence>
                </Pressable>
              </HStack>
            </TouchableOpacity>
          </Box>
        ))}
      </VStack>
    </>
  );
};

// Homestay Section with Tabs and Panel
const HomestayInformationFold = ({ searchQuery }: any) => {
  const [activeCategory, setActiveCategory] = React.useState<string>("abc");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [likes, setLikes] = React.useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const snapshot = await firestore().collection("products").get();
      const db_products: Product[] = snapshot.docs.map((doc) =>
        doc.data()
      ) as Product[];
      console.log("db_products", db_products);
      setProducts(db_products);
      setCategories(
        Array.from(new Set(products.map((product) => product.category)))
      );
    })();
  }, []);
  const handleClose = () => setShowActionsheet(false);
  return (
    <>
      <Box className="px-2 pt-2 border-white-200">
        <HomestayInfoTabs
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
      <HomestayInformationFold searchQuery={searchQuery} />
    </View>
  );
};

export default Home;
