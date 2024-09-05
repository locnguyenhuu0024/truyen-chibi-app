import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  Pressable,
} from "react-native";

type CustomCardComicProps = {
  title?: string;
  thumbnail?: string;
  currentChapter?: string;
  size?: "small" | "medium" | "large";
  slug: string;
};

export default function CustomCardComic({
  title,
  thumbnail,
  currentChapter,
  size = "medium",
  slug,
}: CustomCardComicProps) {
  const router = useRouter();
  const containerStyle: ViewStyle = {
    ...styles.comic,
    ...styles[size],
  };

  const handlePress = () => {
    router.push({
      pathname: `/comics/[slug]`,
      params: {
        slug: slug,
        title: title || "",
      },
    });
  };

  return (
    <Pressable onPress={handlePress} style={containerStyle}>
      <Image source={{ uri: thumbnail }} style={styles.comicThumbnail} />
      <View style={styles.overlay}>
        <Text style={styles.comicTitle} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.chapterText}>{currentChapter}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  comic: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  comicVertical: {
    width: "48%", // Adjust to fit 2 columns with margin
    aspectRatio: 2 / 3, // Maintain a 2:3 aspect ratio
  },
  comicThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
  },
  comicTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  chapterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  small: {
    width: "40%",
    aspectRatio: 2 / 3,
  },
  medium: {
    width: "48%",
    aspectRatio: 2 / 3,
  },
  large: {
    width: "100%",
    aspectRatio: 2 / 3,
  },
});
