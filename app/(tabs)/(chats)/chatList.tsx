import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "@/stores/authStore";
import ChatListItem from "@/components/ChatListItem";
import Chat from "@/types/Chat";
import { Icon } from "@/components/ui/icon";
import { Ban } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";

const ChatList = () => {
  const { user } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .where("participants", "array-contains", user?.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (querySnapshot) => {
          const chatList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Chat[];
          setChats(chatList);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching chat snapshots: ", error);
        }
      );

    return () => unsubscribe();
  }, [user?.uid]);

  return loading ? (
    <VStack className="flex-1 items-center justify-center">
      <Spinner size="large" color={colors.blue[500]} />
    </VStack>
  ) : chats.length !== 0 ? (
    <FlatList
      data={chats}
      renderItem={ChatListItem}
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
