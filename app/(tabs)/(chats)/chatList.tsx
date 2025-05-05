import React, { useCallback, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "@/stores/authStore";
import Chat from "@/types/Chat";
import { Icon } from "@/components/ui/icon";
import { Ban } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import { useSelectedChatStore } from "@/stores/chatStore";
import User from "@/types/User";
import { router, useLocalSearchParams } from "expo-router";
import { View, TouchableOpacity, Image, FlatList } from "react-native";
import ChatWithSellerAndProduct from "@/types/ChatWithSellerAndProduct";
import Product from "@/types/Product";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useFocusEffect } from "@react-navigation/native";

const ChatList = () => {
  const { user } = useAuthStore();
  const [chats, setChats] = useState<ChatWithSellerAndProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedChat, setSelectedChat } = useSelectedChatStore();
  const { openChat } = useLocalSearchParams();

  useEffect(() => {
    if (openChat == "true") {
      router.push("/(tabs)/(chats)/chat");
      return;
    }
  }, []);

  const runOnFocus = useCallback(() => {
    if (!user?.uid) return;

    const unsubscribe = firestore()
      .collection("chats")
      .where("participants", "array-contains", user.uid)
      .onSnapshot(async (querySnapshot) => {
        const chatDocs = querySnapshot.docs;

        const enrichedChats: ChatWithSellerAndProduct[] = await Promise.all(
          chatDocs.map(async (doc) => {
            const chatData = doc.data() as Chat;
            const chatId = doc.id;

            // Fetch otherParticipant (assuming sellerId is the other participant)
            const otherParticipantId = chatData.participants.find(
              (uid) => uid !== user.uid
            );
            let otherParticipant: User | undefined;
            if (otherParticipantId) {
              const sellerDoc = await firestore()
                .collection("users")
                .doc(otherParticipantId)
                .get();
              otherParticipant = sellerDoc.exists
                ? (sellerDoc.data() as User)
                : undefined;
            }

            // Fetch selected product
            let selectedProduct: Product | undefined;
            if (chatData.selectedProductId) {
              const productDoc = await firestore()
                .collection("products")
                .doc(chatData.selectedProductId)
                .get();
              selectedProduct = productDoc.exists
                ? (productDoc.data() as Product)
                : undefined;
            }
            return {
              ...chatData,
              id: chatId,
              otherParticipant,
              selectedProduct,
            };
          })
        );

        setChats(enrichedChats);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  useFocusEffect(runOnFocus);

  const renderItem = ({ item }: { item: ChatWithSellerAndProduct }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
        onPress={() => {
          setSelectedChat(item);
          router.push({
            pathname: "/(tabs)/(chats)/chat",
          });
        }}
      >
        <>
          <Image
            source={{ uri: item.selectedProduct?.image || "" }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              marginRight: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            <HStack className="items-baseline">
              <Text
                style={{ fontSize: 18, fontWeight: "bold" }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.selectedProduct?.title}
              </Text>
              <Divider orientation="vertical" className="mx-2" />
              <Text
                style={{ fontSize: 18, fontWeight: "bold" }}
                numberOfLines={1}
                className="w-[80%]"
                ellipsizeMode="tail"
              >
                {item.otherParticipant?.displayName}
              </Text>
            </HStack>
            <Text style={{ color: "#666" }} className="mt-2">
              {item.lastMessage || "No messages yet."}
            </Text>
          </View>
        </>
      </TouchableOpacity>
    );
  };

  return loading ? (
    <VStack className="flex-1 items-center justify-center">
      <Spinner size="large" color={colors.blue[500]} />
    </VStack>
  ) : chats.length !== 0 ? (
    <FlatList
      data={chats}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 10 }}
    />
  ) : (
    <VStack className="flex-1 items-center justify-center gap-2">
      <Icon as={Ban} size={"xl"} />
      <Text>No Chats</Text>
    </VStack>
  );
};

export default ChatList;
