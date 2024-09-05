import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingIndicatorProps {
  size?: number | "small" | "large";
  color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "large",
  color = "#0000ff",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingIndicator;
