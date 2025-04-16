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
import { useLocalSearchParams } from "expo-router";
import Message from "@/types/Message";
import User from "@/types/User";

const Chat = () => {
  const {
    chatId,
    otherParticipantId,
  }: { chatId: string; otherParticipantId: string } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [participantData, setParticipantData] = useState<User | null>(null);

  useEffect(() => {
    const fetchParticipantData = async () => {
      if (otherParticipantId) {
        const userDoc = await firestore()
          .collection("users")
          .doc(otherParticipantId)
          .get();
        if (userDoc.exists) {
          setParticipantData(userDoc.data() as User);
        }
      }
    };
    fetchParticipantData();
  }, [otherParticipantId]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
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
  }, [chatId]);

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
        .doc(chatId)
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
      .doc(chatId)
      .collection("messages")
      .add(message);

    await firestore().collection("chats").doc(chatId).update({
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
      <View className={`p-3 m-2 rounded-lg max-w-3/4 ${messageStyle}`}>
        <Text>{item.text}</Text>
        {readReceipt ? (
          <Text className="text-xs text-gray-500 mt-1">{readReceipt}</Text>
        ) : null}
      </View>
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
