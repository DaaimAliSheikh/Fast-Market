import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: FirebaseFirestoreTypes.Timestamp;
  readBy: string[]; ///user ids of users who have read the message
}

export default Message;
