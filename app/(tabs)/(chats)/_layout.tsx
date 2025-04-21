import { Button, ButtonIcon } from "@/components/ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";

import React from "react";
import { Text } from "@/components/ui/text";
import { useSelectedChatStore } from "@/stores/chatStore";
import { Stack } from "expo-router";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Info } from "lucide-react-native";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { useAuthStore } from "@/stores/authStore";

export default function Layout() {
  const { selectedChat, clearSelectedChat } = useSelectedChatStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = React.useState(false);

  return (
    <Stack initialRouteName="chatList">
      <Stack.Screen name="chatList" options={{ title: "Chats" }} />
      <Stack.Screen
        name="chat"
        options={{
          headerTitle: () => (
            <HStack space="md" className="items-center justify-between">
              <HStack space="md">
                <Avatar>
                  <AvatarFallbackText>SS</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: selectedChat?.selectedProduct?.image || "",
                    }}
                  />
                </Avatar>
                <VStack>
                  <Heading
                    size="sm"
                    className="max-w-[200px] "
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedChat?.selectedProduct?.title}
                  </Heading>
                  <Text
                    size="sm"
                    className="max-w-[200px] "
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedChat?.otherParticipant?.displayName}
                  </Text>
                </VStack>
              </HStack>
              <Button
                size="lg"
                className="rounded-full p-3.5"
                onPress={() => setShowModal(true)}
              >
                <ButtonIcon as={Info} />
              </Button>
              <Modal
                isOpen={showModal}
                onClose={() => {
                  setShowModal(false);
                }}
                size="md"
              >
                <ModalBackdrop />
                <ModalContent className="min-h-[300px]">
                  <ModalHeader>
                    <Heading size="md" className="text-typography-950">
                      {selectedChat?.selectedProduct?.title}
                    </Heading>
                    <ModalCloseButton>
                      <Icon
                        as={CloseIcon}
                        size="md"
                        className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                      />
                    </ModalCloseButton>
                  </ModalHeader>
                  <ModalBody>
                    <Card className="rounded-lg  max-w-[360px] ">
                      <VStack className="mb-6">
                        <Text className="text-sm font-normal mb-2 text-typography-700">
                          {"PKR " + selectedChat?.selectedProduct?.price}
                        </Text>
                        <Text size="sm">
                          {selectedChat?.selectedProduct?.description}
                        </Text>
                      </VStack>
                      <Image
                        source={{
                          uri: selectedChat?.selectedProduct?.image,
                        }}
                        className="mb-6 h-[200px] mx-auto rounded-md aspect-[4/3]"
                        alt="image"
                      />
                      <Heading size="sm" className="mb-3">
                        Seller Information:
                      </Heading>
                      <Box className="flex-row">
                        <Avatar className="mr-3">
                          <AvatarFallbackText>RR</AvatarFallbackText>
                          <AvatarImage
                            source={{
                              uri:
                                selectedChat?.selectedProduct?.sellerId ===
                                user?.uid
                                  ? (user?.photoURL as string)
                                  : (selectedChat?.otherParticipant
                                      ?.photoURL as string),
                            }}
                            alt="image"
                          />
                        </Avatar>
                        <VStack>
                          <Heading size="sm" className="mb-1">
                            {selectedChat?.selectedProduct?.sellerId ===
                            user?.uid
                              ? user?.displayName
                              : selectedChat?.otherParticipant?.displayName}
                          </Heading>
                          <Text size="sm">
                            {" "}
                            {selectedChat?.selectedProduct?.sellerId ===
                            user?.uid
                              ? user?.email
                              : selectedChat?.otherParticipant?.email}
                          </Text>
                        </VStack>
                      </Box>
                    </Card>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </HStack>
          ),
        }}
      />
    </Stack>
  );
}
