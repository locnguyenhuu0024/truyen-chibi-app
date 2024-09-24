import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import SearchModal from "@/components/SearchModal";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import i18n from "@/utils/languages/i18n";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "@/store/categoriesSlice";
import {
  getCategories,
  getCategory,
  setCategory,
} from "@/store/categoriesSlice";
import {
  logout,
  selectAccessToken,
  selectUser,
  setAccessToken,
  setUser,
} from "@/store/authSlice";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { NavigationBar, NavButton } from "@/components/NavigationBar";
import { Category } from "@/types/comic";
import ApiService from "@/api";
import CategoryPickerModal from "@/components/CategoryPickerModal";
import {
  deleteUserData,
  getAccessToken,
  getUser,
} from "@/utils/secure.store.helper";
import {
  refreshHistories,
  selectRefreshHistories,
} from "@/store/historiesSlice";

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
  const router = useRouter();
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const dispatch = useDispatch();
  const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);
  const categories = useSelector(getCategories);
  const currentCategory = useSelector(getCategory);
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const apiService = new ApiService();
  const refreshHistoriesPage = useSelector(selectRefreshHistories);

  useEffect(() => {
    async function fetchUserData() {
      const user = await getUser();
      const accessToken = await getAccessToken();
      dispatch(setAccessToken(accessToken));
      dispatch(setUser(user));
    }
    fetchUserData();
  }, []);

  const toggleCategoryPicker = () => {
    setIsCategoryPickerVisible(!isCategoryPickerVisible);
  };

  const handleCategoryChange = (category: Category) => {
    dispatch(setCategory(category));
    toggleCategoryPicker();
    router.push({
      pathname: `/[categorySlug]`,
      params: {
        categorySlug: category.slug,
        title: category?.name || "",
      },
    });
  };

  const handleTimePress = () => {
    if (!accessToken) {
      router.navigate("/auth/login");
    } else {
      dispatch(refreshHistories(!refreshHistoriesPage));
      router.navigate("/histories");
    }
  };

  const navigationButtons: NavButton[] = [
    { icon: "home", onPress: () => router.push("/") },
    { icon: "list", onPress: toggleCategoryPicker },
    { icon: "time", onPress: handleTimePress },
    { icon: "search", onPress: () => setIsSearchModalVisible(true) },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      dispatch(setCategories(categoriesData));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    await deleteUserData();
  };

  const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.userInfoSection}>
          <View style={styles.avatarContainer}>
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.avatarText}>
                  {user?.user_name?.[0]?.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.username, { color: color.tint }]}>
            {user?.user_name || "Guest"}
          </Text>
        </View>
        <DrawerItemList {...props} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={color.text} />
          <Text style={[styles.logoutText, { color: color.tabIconDefault }]}>
            {i18n.t("logout")}
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    );
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerActiveTintColor: color.tint,
            headerShown: true,
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
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
            name="profile"
            options={{
              title: i18n.t("profile"),
              drawerIcon: ({ color }) => (
                <TabBarIcon name="person-outline" color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="histories"
            options={{
              title: i18n.t("histories"),
              drawerIcon: ({ color }) => (
                <TabBarIcon name="time" color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="[categorySlug]"
            options={{
              title: i18n.t("categories"),
              drawerIcon: ({ color }) => (
                <TabBarIcon name="list" color={color} />
              ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
      <NavigationBar buttons={navigationButtons} />
      <CategoryPickerModal
        visible={isCategoryPickerVisible}
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        onClose={toggleCategoryPicker}
      />
      <SearchModal
        isVisible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  userInfoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f4",
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderAvatar: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    color: "#fff",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f4",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
