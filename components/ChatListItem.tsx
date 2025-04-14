import { useAuthStore } from "@/stores/authStore";
import Chat from "@/types/Chat";
import User from "@/types/User";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const ChatListItem = ({ item }: { item: Chat }) => {
  const { user } = useAuthStore();
  const otherParticipantId = item.participants.find((uid) => uid !== user?.uid);
  const [participantData, setParticipantData] =
    useState<User | null>(null);

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

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      }}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(chats)/chat",
          params: {
            chatId: item.id,
            otherParticipantId,
          },
        })
      }
    >
      {participantData && (
        <>
          <Image
            source={{ uri: participantData.photoURL || "" }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              marginRight: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {participantData.displayName}
            </Text>
            <Text style={{ color: "#666" }}>{item.lastMessage}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ChatListItem;
