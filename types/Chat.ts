import Message from "./Message";

interface Chat {
  id: string;
  selectedProductId: string;
  participants: string[];
  lastMessage: string;
  messages: Message[];
}

export default Chat;
