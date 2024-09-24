import React, { useEffect, useState } from "react"; // Add useEffect and useState
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { getAccessToken } from "@/utils/secure.store.helper";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, setAccessToken } from "@/store/authSlice";

export interface NavButton {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface NavigationBarProps {
  buttons: NavButton[];
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ buttons }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    fetchAccessToken();
  }, []);

  const fetchAccessToken = async () => {
    const token = await getAccessToken();
    dispatch(setAccessToken(token));
  };

  const handleButtonPress = (onPress: () => void) => {
    if (accessToken) {
      onPress();
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <View style={styles.navigationBar}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navButton}
          onPress={() => handleButtonPress(button.onPress)}
        >
          <Ionicons name={button.icon} size={24} color={Colors["light"].text} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

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
