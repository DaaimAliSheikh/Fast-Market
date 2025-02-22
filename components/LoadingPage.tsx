import { View } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
const LoadingPage = () => {
  return (
    <View className=" flex items-center justify-center h-full ">
      <Spinner size="large" color={colors.gray[500]} />
    </View>
  );
};

export default LoadingPage;
