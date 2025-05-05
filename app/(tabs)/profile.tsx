import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { PowerIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";

import firestore from "@react-native-firebase/firestore";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";

import { Avatar, AvatarBadge, AvatarImage } from "@/components/ui/avatar";
import { Center } from "@/components/ui/center";

import { Divider } from "@/components/ui/divider";

import { useAuthStore } from "@/stores/authStore";
import User from "@/types/User";
import { Spinner } from "@/components/ui/spinner";

import { Pressable, View } from "react-native";
import { Image } from "@/components/ui/image";
import HighlightText from "@/utils/HighlightText";
import Product from "@/types/Product";
import ModalContent from "@/components/ModalContent";
import TabPanel from "@/components/TabPanel";
import TabPanelData from "@/components/TabPanelData";
import { SectionList } from "react-native";
import { usePathname } from "expo-router";

interface UserStats {
  bookmarksCount: number;
  productsCount: number;
  isLoading: boolean;
  error: string | null;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserStats>({
    bookmarksCount: 0,
    productsCount: 0,
    isLoading: true,
    error: null,
  });
  const [activeTab, setActiveTab] = useState<string>("My Products");
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [favoriteProducts, setFavoriteProducts] = React.useState<Product[]>([]);
  const [myProducts, setMyProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [likes, setLikes] = React.useState<string[]>([]); ///id of products liked
  const [refreshing, setRefreshing] = React.useState(false);
  // Get the authenticated user from your auth store
  const { user, logOut } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = React.useState<string>("abc");
  const [categories, setCategories] = React.useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      if (!user) {
        console.error("No user is signed in");
        setLoading(false);
        return;
      }

      // Get current user data to retrieve favoriteProductIds
      const userDoc = await firestore().collection("users").doc(user.uid).get();

      if (!userDoc.exists) {
        console.error("User document not found");
        setLoading(false);
        return;
      }

      const data = userDoc.data() as User;
      const { favoriteProductIds = [] } = data;

      // Fetch products created by the current user
      const myProductsSnapshot = await firestore()
        .collection("products")
        .where("sellerId", "==", user.uid)
        .get();

      const myProductsList: Product[] = myProductsSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Product)
      );

      setMyProducts(myProductsList);
      // Fetch favorite products
      if (favoriteProductIds.length > 0) {
        const snapshot = await firestore()
          .collection("products")
          .where(firestore.FieldPath.documentId(), "in", favoriteProductIds)
          .get();

        const products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavoriteProducts(products as Product[]);
      } else {
        setFavoriteProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics from Firebase
  const fetchUserStats = async () => {
    if (!user || !user.uid) {
      setUserData((prev) => ({
        ...prev,
        isLoading: false,
        error: "User not authenticated",
      }));
      return;
    }

    try {
      // 1. Get user document to count bookmarks (favoriteProductIds)
      const userDoc = await firestore().collection("users").doc(user.uid).get();

      const userData = userDoc.data() as User | undefined;
      const bookmarksCount = userData?.favoriteProductIds?.length || 0;

      // 2. Count products where sellerId matches user.uid
      const productsQuery = await firestore()
        .collection("products")
        .where("sellerId", "==", user.uid)
        .get();

      const productsCount = productsQuery.size;

      // Update state with the fetched data
      setUserData({
        bookmarksCount,
        productsCount,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setUserData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load user statistics",
      }));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    await fetchUserStats();
    setRefreshing(false);
  };
  useEffect(() => {
    fetchProducts();
    fetchUserStats();
  }, []);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(
        [...myProducts, ...favoriteProducts].map((product) => product.category)
      ),
    ];
    setCategories(uniqueCategories);
    if (uniqueCategories && uniqueCategories.length > 0)
      setActiveCategory(uniqueCategories[0]);
    (async () => {
      const userDoc = await firestore()
        .collection("users")
        .doc(user?.uid)
        .get();
      if (userDoc.exists) {
        setLikes(userDoc.data()?.favoriteProductIds || []); ///id of products liked
      }
    })();
  }, [myProducts, favoriteProducts]);
  const handleClose = () => setShowActionsheet(false);

  const sections = [
    {
      title: "Profile",
      data: [{ id: "profile-section" }], // Add a data array with at least one item
      renderItem: () => (
        <VStack className="mb-10" space="2xl">
          <Box className="relative w-full md:h-[478px] h-[380px]"></Box>
          <HStack className="absolute pt-6 px-10 hidden md:flex">
            <Text className="text-typography-900 font-roboto">
              home &gt; {` `}
            </Text>
            <Text className="font-semibold text-typography-900 ">profile</Text>
          </HStack>
          <Center className="absolute md:mt-14 mt-6 w-full md:px-10 md:pt-6 pb-4">
            <VStack space="lg" className="items-center">
              <Avatar size="2xl" className="bg-primary-600">
                <AvatarImage
                  alt="Profile Image"
                  height={100}
                  width={100}
                  source={require("@/assets/FAST-LOGO.png")}
                />
                <AvatarBadge />
              </Avatar>
              <VStack className="gap-1 w-full items-center">
                <Text size="2xl" className="font-roboto text-dark text-center">
                  {user?.displayName}
                </Text>
                <Text className="font-roboto text-sm text-typograpphy-700">
                  {user?.email}
                </Text>
              </VStack>
              <HStack className="items-center gap-1">
                <VStack className="py-3 px-4 items-center" space="xs">
                  <Text className="text-dark font-roboto font-semibold justify-center items-center">
                    {userData.productsCount}
                  </Text>
                  <Text className="text-dark text-xs font-roboto">
                    products
                  </Text>
                </VStack>
                <Divider orientation="vertical" className="h-10" />
                <VStack className="py-3 px-4 items-center" space="xs">
                  <Text className="text-dark font-roboto font-semibold">
                    {userData.bookmarksCount}
                  </Text>
                  <Text className="text-dark text-xs font-roboto">
                    favorites
                  </Text>
                </VStack>
              </HStack>
              <Button
                variant="outline"
                action="secondary"
                onPress={async () => await logOut()}
                className="gap-3 relative bg-red-400 "
              >
                <ButtonText className="text-dark ">Logout</ButtonText>
                <ButtonIcon as={PowerIcon} />
              </Button>
            </VStack>
          </Center>
        </VStack>
      ),
    },
    {
      title: "Products",
      data: [{ id: "products-section" }], // Add a data array with at least one item
      renderItem: () => (
        <VStack className="mx-6 -mt-20" space="2xl">
          <Heading className="font-roboto" size="xl">
            Account
          </Heading>
          <Tabs
            tabs={["My Products", "Favorites"]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <View className="h-1 w-full bg-white"></View>
          <>
            <Box className="px-2 pt-2 border-white-200">
              <TabPanel
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </Box>
            {activeTab === "My Products" ? (
              <TabPanelData
                setShowActionsheet={setShowActionsheet}
                activeCategory={activeCategory}
                products={myProducts}
                setSelectedProduct={setSelectedProduct}
                searchQuery={""}
                likes={likes}
                setLikes={setLikes}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            ) : (
              <TabPanelData
                setShowActionsheet={setShowActionsheet}
                activeCategory={activeCategory}
                products={favoriteProducts}
                setSelectedProduct={setSelectedProduct}
                searchQuery={""}
                likes={likes}
                setLikes={setLikes}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            )}

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
        </VStack>
      ),
    },
  ];

  // Show loading indicator while data is being fetched
  if (userData.isLoading) return <Spinner />;

  return (
    <VStack className="h-full w-full mb-16 md:mb-0">
      <SectionList
        sections={sections}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item) => item.id}
        renderItem={({ section }) => section.renderItem()}
      />
    </VStack>
  );
};
export default Profile;

const Tabs = ({ tabs, activeTab, setActiveTab }: any) => {
  return (
    <HStack space="lg" className=" xl:gap-5  flex  2xl:gap-6">
      {tabs.map((tab: string) => (
        <Pressable
          key={tab}
          className={`my-0.5 p-2 ${
            activeTab === tab ? "border-b-[3px]" : "border-b-0"
          } border-primary-600 hover:border-b-[3px] flex-1 ${
            activeTab === tab
              ? "hover:border-outline-900"
              : "hover:border-outline-200"
          }`}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            size="sm"
            className={`${
              activeTab === tab ? "text-primary-500" : "text-typography-600"
            } font-medium  text-center`}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );
};
