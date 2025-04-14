import Message from "./Message";

interface Chat {
  id: string;
  targetProductId: string;
  participants: string[];
  lastMessage: string;
  messages: Message[];
}

export default Chat;
