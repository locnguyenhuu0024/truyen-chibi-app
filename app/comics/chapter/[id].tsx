import { getChapterById } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ChapterResponse, ImageSize } from "@/types/chapter";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { Alert, Button } from "react-native";
import { Image as RNImage, ActivityIndicator } from "react-native";
import { ScrollView, StyleSheet, Dimensions, View } from "react-native";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageDimensions {
  width: number;
  height: number;
}

export default function ChapterPage() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [chapterData, setChapterData] = useState<ChapterResponse>();
  const [error, setError] = useState<string | null>(null);
  const [imageSizes, setImageSizes] = useState<ImageSize[]>([]);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);

  useEffect(() => {
    if (id) {
      fetchChapterData(id as string);
      navigation.setOptions({ title: `` });
    }
  }, [id]);

  useEffect(() => {
    if (chapterData) {
      const fetchImageSizes = async () => {
        const sizes: ImageSize[] = await Promise.all(
          chapterData.chapter_images.map(
            (image) =>
              new Promise<ImageSize>((resolve) => {
                RNImage.getSize(image.image_file, (width, height) => {
                  resolve({ width, height });
                });
              })
          )
        );
        setImageSizes(sizes);
      };

      fetchImageSizes();
    }
  }, [chapterData]);

  useEffect(() => {
    if (chapterData) {
      setLoadedImages(new Array(chapterData.chapter_images.length).fill(false));
    }
  }, [chapterData]);

  const fetchChapterData = useCallback(async (chapterId: string) => {
    try {
      const response = await getChapterById(chapterId);
      setChapterData(response);
      navigation.setOptions({ title: `${response.comic_name}` });
      setError(null);
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      setError("Failed to load chapter data. Please try again.");
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (id) {
      fetchChapterData(id as string);
    }
  }, [id, fetchChapterData]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  if (!chapterData) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <SkeletonLoader style={styles.chapterTitle} />
        {[...Array(5)].map((_, index) => (
          <SkeletonLoader
            key={index}
            style={{ ...styles.image, height: 200 }}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.chapterTitle}>
        Chapter {chapterData.chapter_name}
      </ThemedText>
      {chapterData.chapter_images.map((image, index) => (
        <View key={image.image_file} style={styles.imageContainer}>
          {!loadedImages[index] && (
            <ActivityIndicator size="large" style={styles.loader} />
          )}
          <RNImage
            source={{ uri: image.image_file }}
            style={[
              styles.image,
              {
                width: SCREEN_WIDTH,
                height:
                  SCREEN_WIDTH *
                  (imageSizes[index]?.height / imageSizes[index]?.width || 1),
              },
            ]}
            resizeMode="contain"
            onLoad={() => {
              setLoadedImages((prev) => {
                const newLoadedImages = [...prev];
                newLoadedImages[index] = true;
                return newLoadedImages;
              });
            }}
            onError={(error) =>
              console.error(
                `Error loading image ${index}:`,
                error.nativeEvent.error
              )
            }
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  image: {
    marginBottom: 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  loader: {
    marginBottom: 10,
  },
});
