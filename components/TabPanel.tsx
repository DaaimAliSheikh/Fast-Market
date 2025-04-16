import { Pressable, ScrollView } from "react-native";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Box } from "./ui/box";

const TabPanel = ({ categories, activeCategory, setActiveCategory }: any) => {
  return (
    <Box className="border-b border-outline-50  mb-2 md:border-b-0 md:border-transparent">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="lg" className="mx-0.5 xl:gap-5 2xl:gap-6">
          {categories.map((cat: string) => (
            <Pressable
              key={cat}
              className={`my-0.5 p-2 ${
                activeCategory === cat ? "border-b-[3px]" : "border-b-0"
              } border-primary-600 hover:border-b-[3px] ${
                activeCategory === cat
                  ? "hover:border-outline-900"
                  : "hover:border-outline-200"
              }`}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                size="sm"
                className={`${
                  activeCategory === cat
                    ? "text-primary-500"
                    : "text-typography-600"
                } font-medium`}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

export default TabPanel;
