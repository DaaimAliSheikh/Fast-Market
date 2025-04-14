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
import { router } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import User from "@/types/User";
import addProductToFavorites from "@/utils/addProductToFavorites";
import { AnimatePresence, Motion } from "@legendapp/motion";
import { Icon } from "./ui/icon";
import { Heart } from "lucide-react-native";

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
  const [seller, setSeller] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const { user } = useAuthStore();

  const onStartChat = async () => {
    handleClose();
    /////create new chat, or find existing chat
    // router.push({
    //   pathname: "/(tabs)/(chats)/chat",
    //   params: {
    //     // chatId: item.id,
    //     // otherParticipantId,
    //   },
    // });
  };
  const onFavorite = async () => {
    setLiked(!liked);
    if (likes.includes(selectedProduct.title)) {
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
        const querySnapshot = await firestore()
          .collection("users")
          .where("uid", "==", selectedProduct.sellerId)
          .get();
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as User;
        if (userData) {
          setSeller(userData as User);
        } else {
          console.warn("Seller not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    fetchSellerData();
  }, []);
  return (
    <ScrollView className="h-[60vh] border mb-14">
      <Card className="rounded-lg  max-w-[360px] ">
        <VStack className="mb-6">
          <Heading size="md" className="mb-4">
            {selectedProduct.title}
          </Heading>
          <Text className="text-sm font-normal mb-2 text-typography-700">
            {selectedProduct.price}
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
          <Button className="px-4  py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 flex-1">
            <ButtonText size="sm">Start Chat</ButtonText>
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
                    liked
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
