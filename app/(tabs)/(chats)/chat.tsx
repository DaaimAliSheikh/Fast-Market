import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "@/stores/authStore";
import Message from "@/types/Message";
import User from "@/types/User";
import { useSelectedChatStore } from "@/stores/chatStore";
import { Icon } from "@/components/ui/icon";
import { CheckCheck } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

const Chat = () => {
  const { selectedChat, setSelectedChat } = useSelectedChatStore();
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [seller, setSeller] = useState<User | null>(null);
  const [selectedProduct, setSelectedProductId] = useState<User | null>(null);

  useEffect(() => {
    const fetchParticipantData = async () => {
      const otherParticipantId = selectedChat?.participants.find(
        (p) => p !== user?.uid
      );
      if (otherParticipantId) {
        const userDoc = await firestore()
          .collection("users")
          .doc(otherParticipantId)
          .get();
        if (userDoc.exists) {
          setSeller(userDoc.data() as User);
        }
      }
    };
    fetchParticipantData();
    const fetchProduct = async () => {
      const userDoc = await firestore()
        .collection("products")
        .doc(selectedChat?.selectedProductId)
        .get();
      if (userDoc.exists) {
        setSelectedProductId(userDoc.data() as User);
      }
    };
    fetchParticipantData();
  }, [selectedChat]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .doc(selectedChat?.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((querySnapshot) => {
        const msgs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];

        setMessages(msgs);
        markMessagesAsRead(msgs);
      });

    return () => unsubscribe();
  }, [selectedChat]);

  const markMessagesAsRead = async (msgs: Message[]) => {
    const unreadMessages = msgs.filter(
      (msg) =>
        !msg.readBy.includes(user?.uid || "") &&
        msg.senderId !== (user?.uid || "")
    );

    const batch = firestore().batch();
    unreadMessages.forEach((msg) => {
      const msgRef = firestore()
        .collection("chats")
        .doc(selectedChat?.id)
        .collection("messages")
        .doc(msg.id);
      batch.update(msgRef, {
        readBy: firestore.FieldValue.arrayUnion(user?.uid),
      });
    });
    await batch.commit();
  };

  const sendMessage = async () => {
    if (newMessage.trim().length === 0) return;

    const message = {
      senderId: user?.uid,
      text: newMessage,
      timestamp: firestore.FieldValue.serverTimestamp(),
      readBy: [user?.uid],
    };

    await firestore()
      .collection("chats")
      .doc(selectedChat?.id)
      .collection("messages")
      .add(message);

    await firestore().collection("chats").doc(selectedChat?.id).update({
      lastMessage: newMessage,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });

    setNewMessage("");
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === user?.uid;
    const messageStyle = isCurrentUser
      ? "bg-blue-500 text-white self-end"
      : "bg-gray-200 text-black self-start";
    const readReceipt = isCurrentUser && item.readBy.length > 1 ? "Read" : "";

    return (
      <VStack className={`p-3 m-2 rounded-lg max-w-3/4 ${messageStyle}`}>
        <Text>{item.text}</Text>
        <HStack space="sm" className="items-center justify-end mt-1">
          <Text className="text-xs">
            {item.timestamp
              .toDate()
              .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </Text>
          {readReceipt ? <Icon as={CheckCheck} color="white" /> : null}
        </HStack>
      </VStack>
    );
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View className="flex-row items-center border-t border-gray-300 pt-2">
        <TextInput
          className="flex-1 bg-gray-100 p-3 rounded-full mr-2"
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-full"
          onPress={sendMessage}
        >
          <Text className="text-white">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;
