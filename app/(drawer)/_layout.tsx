import { Drawer } from "expo-router/drawer";
import React, { useState } from "react";
import FloatingSearchButton from "@/components/FloatingSearchButton";
import SearchModal from "@/components/SearchModal";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import i18n from "@/utils/languages/i18n";

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: i18n.t("home"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="latest"
        options={{
          tabBarLabel: i18n.t("latest"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function DrawerLayout() {
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: true,
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: "Truyện Chibi",
              drawerIcon: ({ color }) => (
                <TabBarIcon name="home-outline" color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="explore"
            options={{
              title: "Explore",
              drawerIcon: ({ color }) => (
                <TabBarIcon name="search-outline" color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              title: i18n.t("profile"),
              drawerIcon: ({ color }) => (
                <TabBarIcon name="person-outline" color={color} />
              ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
      <FloatingSearchButton onPress={() => setIsSearchModalVisible(true)} />
      <SearchModal
        isVisible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
      />
    </>
  );
}
