import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

interface FloatingSearchButtonProps {
  onPress: () => void;
}

const FloatingSearchButton: React.FC<FloatingSearchButtonProps> = ({
  onPress,
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colorScheme === "dark" ? "#333" : "#fff" },
      ]}
      onPress={onPress}
    >
      <Ionicons
        name="search"
        size={24}
        color={colorScheme === "dark" ? "#fff" : "#000"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default FloatingSearchButton;
