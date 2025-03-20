import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: FirebaseFirestoreTypes.Timestamp;
  readBy: string[];
}

export default Message;
