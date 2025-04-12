import React from "react";
import { ScrollView, View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon, Heart } from "lucide-react-native";
import { AnimatePresence, Motion } from "@legendapp/motion";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
// Tabs Component
const HomestayInfoTabs = ({ tabs, activeTab, setActiveTab }: any) => {
  return (
    <Box className="border-b border-outline-50  mb-2 md:border-b-0 md:border-transparent">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="lg" className="mx-0.5 xl:gap-5 2xl:gap-6">
          {tabs.map((tab: any) => (
            <Pressable
              key={tab.title}
              className={`my-0.5 p-2 ${
                activeTab === tab ? "border-b-[3px]" : "border-b-0"
              } border-primary-600 hover:border-b-[3px] ${
                activeTab === tab
                  ? "hover:border-outline-900"
                  : "hover:border-outline-200"
              }`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                size="sm"
                className={`${
                  activeTab === tab ? "text-primary-500" : "text-typography-600"
                } font-medium`}
              >
                {tab.title}
              </Text>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

// Sample Tabs and Data
const tabs = [{ title: "Tropical" }];

const tabsData = [
  {
    name: "tropical",
    data: [
      {
        title: "ImageView Inn",
        src: require("@/assets/FAST-LOGO.png"),
        description:
          "401 Platte River Rd, Gothenburg, United States 01 Platte River Rd, Gothenburg, United States 01 Platte River Rd, Gothenburg, United States 01 Platte River Rd, Gothenburg, United States 01 Platte River Rd, Gothenburg, United States",
        price: "$1,481",
        rating: 4.9,
      },
      {
        title: "Spinner Resort",
        src: require("@/assets/FAST-LOGO.png"),
        description: "1502 Silica Ave, Sacramento California",
        price: "$1,381",
        rating: 4.89,
      },
      {
        title: "DropDown Den",
        src: require("@/assets/FAST-LOGO.png"),
        description: "2945 Entry Point Blvd, Kissimmee, Florida",
        price: "$2,481",
        rating: 4.6,
      },
    ],
  },
];

const HighlightText = ({
  text,
  highlight,
  numberOfLines = 1,
}: {
  text: string;
  highlight: string;
  numberOfLines?: number;
}) => {
  if (!highlight) {
    return (
      <Text numberOfLines={numberOfLines} ellipsizeMode="tail">
        {text}
      </Text>
    );
  }

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <Text numberOfLines={numberOfLines} ellipsizeMode="tail">
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={i} className="bg-yellow-200">
            {part}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </Text>
  );
};

// Tab Panel with Search Filtering
const TabPanelData = ({ activeTab, searchQuery, setShowActionsheet }: any) => {
  const [likes, setLikes] = React.useState<string[]>([]);

  const data =
    tabsData.find(
      (tab) => tab.name.toLowerCase() === activeTab.title.toLowerCase()
    )?.data || [];

  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <VStack className="flex-1">
        {filteredData.map((image: any, index: any) => (
          <Box
            key={index}
            className={`flex-1 my-4 lg:my-0 ${
              index === 0 ? "lg:ml-0" : "lg:ml-2"
            } ${index === filteredData.length - 1 ? "lg:mr-0" : "lg:mr-2"}`}
          >
            <Pressable
              className="w-full"
              onPress={() => setShowActionsheet(true)}
            >
              <Box className="overflow-hidden rounded-md h-72">
                <Image
                  source={image.src}
                  className="w-full contain h-72"
                  alt="product image"
                />
              </Box>

              <HStack className="justify-between py-2 items-start">
                <VStack space="sm" className="flex-1">
                  <HighlightText
                    text={image.title}
                    highlight={searchQuery}
                    numberOfLines={1}
                  />
                  <HighlightText
                    text={image.description}
                    highlight={searchQuery}
                    numberOfLines={2}
                  />
                  <HStack>
                    <Text
                      size="sm"
                      className="font-semibold text-typography-900"
                    >
                      {image.price}
                    </Text>
                  </HStack>
                </VStack>
                <Pressable
                  onPress={() => {
                    if (likes.includes(image.title)) {
                      setLikes((prev) =>
                        prev.filter((like: any) => like !== image.title)
                      );
                    } else {
                      setLikes((prev) => [...prev, image.title]);
                    }
                  }}
                  className="absolute top-3 right-4 h-6 w-6 justify-center items-center"
                >
                  <AnimatePresence>
                    <Motion.View
                      key={likes.includes(image.title) ? "liked" : "unliked"}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      transition={{
                        type: "spring",
                        mass: 0.9,
                        damping: 9,
                        stiffness: 300,
                      }}
                      style={{ position: "absolute" }}
                    >
                      <Icon
                        as={Heart}
                        size="lg"
                        className={`${
                          likes.includes(image.title)
                            ? "fill-red-500 stroke-red-500"
                            : "fill-gray-500 stroke-white"
                        }`}
                      />
                    </Motion.View>
                  </AnimatePresence>
                </Pressable>
              </HStack>
            </Pressable>
          </Box>
        ))}
      </VStack>
    </>
  );
};

// Homestay Section with Tabs and Panel
const HomestayInformationFold = ({ searchQuery }: any) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  return (
    <>
      <Box className="px-2 pt-2 border-white-200">
        <HomestayInfoTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Box>
      <ScrollView className="px-4 md:px-0 flex-1">
        <TabPanelData
          setShowActionsheet={setShowActionsheet}
          activeTab={activeTab}
          searchQuery={searchQuery}
        />
      </ScrollView>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[75]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper className="py-4">
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ModalContent />
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Edit Message</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Mark Unread</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Remind Me</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Add to Saved Items</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem isDisabled onPress={handleClose}>
            <ActionsheetItemText>Delete</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

// Main Home Component
const Home = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View className="flex-1">
      <Input className="rounded-full mx-2 my-2">
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Input>
      <HomestayInformationFold searchQuery={searchQuery} />
    </View>
  );
};

export default Home;

function ModalContent() {
  return (
    <Card className="rounded-lg max-w-[360px] ">
      <VStack className="mb-6">
        <Heading size="md" className="mb-4">
          The Power of Positive Thinking
        </Heading>
        <Text className="text-sm font-normal mb-2 text-typography-700">
          May 15, 2023
        </Text>
        <Text size="sm">
          Discover how the power of positive thinking can transform your life,
          boost your confidence, and help you overcome challenges. Explore
          practical tips and techniques to cultivate a positive mindset for
          greater happiness and success.
        </Text>
      </VStack>
      <Box className="flex-row">
        <Avatar className="mr-3">
          <AvatarFallbackText>RR</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: "https://gluestack.github.io/public-blog-video-assets/john.png",
            }}
            alt="image"
          />
        </Avatar>
        <VStack>
          <Heading size="sm" className="mb-1">
            John Smith
          </Heading>
          <Text size="sm">Motivational Speaker</Text>
        </VStack>
      </Box>
    </Card>
  );
}
