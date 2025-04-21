// selectedChatStore.ts
import { create } from "zustand";
import Chat from "../types/Chat";
import ChatWithSellerAndProduct from "@/types/ChatWithSellerAndProduct";

interface SelectedChatStore {
  selectedChat: ChatWithSellerAndProduct | null;
  setSelectedChat: (chat: ChatWithSellerAndProduct) => void;
  clearSelectedChat: () => void;
}

export const useSelectedChatStore = create<SelectedChatStore>((set, get) => ({
  selectedChat: null,

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  clearSelectedChat: () => set({ selectedChat: null }),
}));
