import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface NavButton {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface NavigationBarProps {
  buttons: NavButton[];
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ buttons }) => (
  <View style={styles.navigationBar}>
    {buttons.map((button, index) => (
      <TouchableOpacity
        key={index}
        onPress={button.onPress}
        style={styles.navButton}
      >
        <Ionicons name={button.icon} size={20} color="black" />
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 25,
    padding: 10,
    margin: 10,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navButton: {
    padding: 10,
  },
});
