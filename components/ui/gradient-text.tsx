import React from "react";
import { Text, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const GradientText = ({
  text,
  colors,
  maskedViewHeight,
}: {
  text: string;
  colors: [string, string, ...string[]]; // Tuple type with at least two elements
  maskedViewHeight: number;
}) => {
  return (
    <MaskedView
      style={{ height: maskedViewHeight }}
      maskElement={<Text style={styles.text}>{text}</Text>}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0.33 }}
        style={{ flex: 1 }}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontWeight: "bold",
  },
  gradient: {
    flex: 1,
  },
});

export default GradientText;
