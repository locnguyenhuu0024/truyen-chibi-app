import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/authSlice";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { AppDispatch, RootState } from "@/store";
import { SignupRequest } from "@/types/auth";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const [signupData, setSignupData] = useState<SignupRequest>({
    email: "",
    password: "",
    user_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    birth: undefined,
    gender: undefined,
    avatar: undefined,
  });
  const color = Colors[colorScheme ?? "light"];
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleRegister = async () => {
    try {
      await dispatch(registerUser(signupData)).unwrap();
      router.replace("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const updateSignupData = (key: keyof SignupRequest, value: any) => {
    setSignupData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Register</ThemedText>
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="Email"
        value={signupData.email}
        onChangeText={(value) => updateSignupData("email", value.toLowerCase())}
        keyboardType="email-address"
        placeholderTextColor={color.placeholderText}
      />
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="Password"
        value={signupData.password}
        onChangeText={(value) => updateSignupData("password", value)}
        secureTextEntry
        placeholderTextColor={color.placeholderText}
      />
      <TextInput
        style={[styles.input, { color: color.text }]}
        placeholder="Username"
        value={signupData.user_name}
        onChangeText={(value) => updateSignupData("user_name", value)}
        placeholderTextColor={color.placeholderText}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color.backgroundButton }]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <ThemedText style={[styles.buttonText, { color: color.textButton }]}>
          {isLoading ? "Registering..." : "Register"}
        </ThemedText>
      </TouchableOpacity>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <ThemedText style={styles.linkText}>
          Already have an account? Login
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
