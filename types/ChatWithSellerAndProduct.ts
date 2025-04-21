import Chat from "./Chat";
import Product from "./Product";
import User from "./User";

interface ChatWithSellerAndProduct extends Chat {
  otherParticipant?: User;
  selectedProduct?: Product;
}
export default ChatWithSellerAndProduct;
