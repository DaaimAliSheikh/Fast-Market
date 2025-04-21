import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "react-native";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { Image } from "./ui/image";
import { Box } from "./ui/box";
import { Button, ButtonText } from "./ui/button";
import Product from "@/types/Product";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "@/stores/authStore";
import User from "@/types/User";
import addProductToFavorites from "@/utils/addProductToFavorites";
import { AnimatePresence, Motion } from "@legendapp/motion";
import { Icon } from "./ui/icon";
import { Heart } from "lucide-react-native";
import Chat from "@/types/Chat";
import { useSelectedChatStore } from "@/stores/chatStore";
import { router } from "expo-router";
import { Spinner } from "./ui/spinner";

function ModalContent({
  selectedProduct,
  handleClose,
  likes,
  setLikes,
}: {
  selectedProduct: Product;
  handleClose: () => void;
  likes: string[];
  setLikes: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [seller, setSeller] = useState<User | null>(null);

  const { user } = useAuthStore();
  const { setSelectedChat } = useSelectedChatStore();
  const onStartChat = async () => {
    setLoading(true);
    if (!user?.uid || !selectedProduct?.sellerId || !seller) return;

    const participants = [user.uid, selectedProduct.sellerId];
    const productId = selectedProduct.id;

    try {
      // Query for existing chat
      const existingChatsSnapshot = await firestore()
        .collection("chats")
        .where("participants", "array-contains", user.uid)
        .get();

      let existingChat: Chat | null = null;

      existingChatsSnapshot.forEach((doc) => {
        const data = doc.data() as Chat;
        if (
          data.participants.includes(selectedProduct.sellerId) &&
          data.selectedProductId === productId
        ) {
          existingChat = { ...data, id: doc.id };
          // chatId = doc.id;
          console.log("Existing chat found:", existingChat);
        }
      });

      if (!existingChat) {
        // Create new chat
        console.log("Creating new chat");
        const newChatRef = await firestore().collection("chats").add({
          participants,
          selectedProductId: productId,
          lastMessage: "",
          messages: [],
        });
        const newChatSnapshot = await newChatRef.get();
        const newChatData = newChatSnapshot.data() as Chat;
        // Update global state
        setSelectedChat({
          ...newChatData,
          id: newChatSnapshot.id,
          otherParticipant: seller,
          selectedProduct,
        });
      } else {
        // Update global state
        setSelectedChat({
          ...(existingChat as Chat),
          otherParticipant: seller,
          selectedProduct,
        });
      }
      setLoading(false);
      handleClose();
      // Navigate to chat screen
      router.push("/(tabs)/(chats)/chat");
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };
  const onFavorite = async () => {
    if (likes.includes(selectedProduct.id)) {
      setLikes((prev) =>
        prev.filter((like: any) => like !== selectedProduct.id)
      );
    } else {
      setLikes((prev) => [...prev, selectedProduct.id]);
    }
    await addProductToFavorites(selectedProduct.id, user?.uid || "");
  };
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const docSnapshot = await firestore()
          .collection("users")
          .doc(selectedProduct.sellerId)
          .get();

        if (docSnapshot.exists) {
          const userData = docSnapshot.data() as User;
          setSeller(userData);
        } else {
          console.warn("Seller not found");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    fetchSellerData();
  }, []);
  return (
    <ScrollView className="h-[60vh]  mb-14">
      <Card className="rounded-lg  max-w-[360px] ">
        <VStack className="mb-6">
          <Heading size="md" className="mb-4">
            {selectedProduct.title}
          </Heading>
          <Text className="text-sm font-normal mb-2 text-typography-700">
            {"PKR " + selectedProduct.price}
          </Text>
          <Text size="sm">{selectedProduct.description}</Text>
        </VStack>
        <Image
          source={{
            uri: selectedProduct.image,
          }}
          className="mb-6 h-[200px] mx-auto rounded-md aspect-[4/3]"
          alt="image"
        />
        <Heading size="sm" className="mb-3">
          Seller Information:
        </Heading>
        <Box className="flex-row">
          <Avatar className="mr-3">
            <AvatarFallbackText>RR</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: seller?.photoURL || "",
              }}
              alt="image"
            />
          </Avatar>
          <VStack>
            <Heading size="sm" className="mb-1">
              {seller?.displayName}
            </Heading>
            <Text size="sm">{seller?.email}</Text>
          </VStack>
        </Box>
      </Card>
      <Card className="p-5 rounded-lg w-full ">
        <Box className="flex-row  gap-2">
          <Button
            className="px-4  py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 flex-1"
            onPress={onStartChat}
          >
            {loading ? (
              <Spinner color={"white"} />
            ) : (
              <ButtonText size="sm">Start Chat</ButtonText>
            )}
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 border-outline-300 flex-1 flex-row items-center justify-center"
            onPress={onFavorite}
          >
            <ButtonText size="sm" className="text-typography-600 ">
              Favorite
            </ButtonText>
            <AnimatePresence>
              <Motion.View
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  mass: 0.9,
                  damping: 9,
                  stiffness: 300,
                }}
              >
                <Icon
                  as={Heart}
                  size="lg"
                  className={`${
                    likes.includes(selectedProduct.id)
                      ? "fill-red-500 stroke-red-500"
                      : "fill-gray-500 stroke-white"
                  }`}
                />
              </Motion.View>
            </AnimatePresence>
          </Button>
        </Box>
      </Card>
    </ScrollView>
  );
}

export default ModalContent;
