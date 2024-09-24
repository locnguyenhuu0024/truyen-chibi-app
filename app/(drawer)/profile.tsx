import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  TextInput,
  Button,
  useColorScheme,
  TouchableOpacity,
  View,
  Image,
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import i18n from "@/utils/languages/i18n";
import { getUser } from "@/utils/secure.store.helper";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleUpdate = () => {
    console.log("User updated:", user);
  };

  const updateUserField = (field: keyof User, value: string) => {
    if (user) {
      setUser({ ...user, [field]: value });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.avatarContainer}>
        {user?.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={[styles.avatarText, { color: color.tint }]}>
              {user?.user_name?.[0]?.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="user Name"
        value={user?.user_name}
        onChangeText={(text) => updateUserField("user_name", text)}
        placeholderTextColor={color.placeholderText}
      />
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="Email"
        value={user?.email}
        onChangeText={(text) => updateUserField("email", text)}
        placeholderTextColor={color.placeholderText}
      />
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="First Name"
        value={user?.first_name}
        onChangeText={(text) => updateUserField("first_name", text)}
        placeholderTextColor={color.placeholderText}
      />
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="Last Name"
        value={user?.last_name}
        onChangeText={(text) => updateUserField("last_name", text)}
        placeholderTextColor={color.placeholderText}
      />
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: color.backgroundButton,
          },
        ]}
        onPress={handleUpdate}
        disabled={false}
      >
        <ThemedText style={[styles.buttonText, { color: color.textButton }]}>
          {i18n.t("update")}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  placeholderAvatar: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
  },
});
