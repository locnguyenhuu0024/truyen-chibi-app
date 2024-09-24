import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { AppDispatch, RootState } from "@/store";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const color = Colors[colorScheme ?? "light"];

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.replace("/(drawer)");
    } catch (err) {
      console.error("Login failed");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Login</ThemedText>
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor={color.placeholderText}
      />
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={color.placeholderText}
      />
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: color.backgroundButton,
          },
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <ThemedText style={[styles.buttonText, { color: color.textButton }]}>
          {isLoading ? "Logging in..." : "Login"}
        </ThemedText>
      </TouchableOpacity>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <ThemedText style={[styles.linkText]}>
          Don't have an account? Register
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  linkText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 20,
  },
});
