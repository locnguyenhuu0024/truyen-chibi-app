import ApiService from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ChapterResponse, ImageSize } from "@/types/chapter";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  FlatList as ChapterFlatList,
  Text,
} from "react-native";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChapterId, selectChapterList } from "@/store/chaptersSlice";
import i18n from "@/utils/languages/i18n";
import { Modal, TouchableOpacity } from "react-native";
import { ChapterData } from "@/types/comic";
import { NavigationBar, NavButton } from "@/components/NavigationBar";
import { selectCurrentComic } from "@/store/comicsSlice";
import { HistorySaveRequest } from "@/types/history";
import { updateHistory } from "@/store/historiesSlice";
import { getAccessToken } from "@/utils/secure.store.helper";
import { selectAccessToken } from "@/store/authSlice";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ChapterPage() {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();
  const flatListRef = useRef<FlatList>(null);
  const chapterFlatListRef = useRef<ChapterFlatList>(null);
  const [chapterData, setChapterData] = useState<ChapterResponse>();
  const [error, setError] = useState<string | null>(null);
  const [imageSizes, setImageSizes] = useState<ImageSize[]>([]);
  const accessToken = useSelector(selectAccessToken);
  const chapterList = useSelector(selectChapterList);
  const currentComic = useSelector(selectCurrentComic);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const apiService = new ApiService();

  useEffect(() => {
    if (id) {
      dispatch(setCurrentChapterId(id as string));
      fetchChapterData(id as string);
      navigation.setOptions({ title: `` });
    }
  }, [id]);

  useEffect(() => {
    if (chapterData) {
      saveHistoryData();
    }
  }, [chapterData]);

  const fetchChapterData = useCallback(async (chapterId: string) => {
    try {
      const response = await apiService.getChapterById(chapterId);
      setChapterData(response);
      const sizes: ImageSize[] = await Promise.all(
        response.chapter_images.map(
          (image) =>
            new Promise<ImageSize>((resolve) => {
              Image.getSize(image.image_file, (width, height) => {
                resolve({ width, height });
              });
            })
        )
      );
      setImageSizes(sizes);
      navigation.setOptions({ title: `${response.comic_name}` });
      setError(null);
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      setError("Failed to load chapter data. Please try again.");
    }
  }, []);

  const saveHistoryData = async () => {
    try {
      const historyRequest: HistorySaveRequest = {
        slug: currentComic.slug,
        latest_read_chapter_id: id,
        thumbnail: currentComic.thumb_url,
        name: currentComic.name,
        latest_read_chapter: chapterData?.chapter_name,
      };

      if (accessToken) {
        console.log(accessToken);
        const history = await apiService.saveHistory(historyRequest);
        dispatch(updateHistory(history));
      }
    } catch (error) {
      // @ts-ignore
      console.log("Save history failed!", error.message);
    }
  };

  const handleRetry = useCallback(() => {
    if (id) {
      fetchChapterData(id as string);
    }
  }, [id, fetchChapterData]);

  const handleNextChapter = () => {
    const currentIndex = chapterList.findIndex(
      (chapter) => chapter.chapter_id === id
    );
    if (currentIndex < chapterList.length - 1) {
      const nextChapterId = chapterList[currentIndex + 1].chapter_id;
      router.push(`/comics/chapter/${nextChapterId}`);
    } else {
      console.log("This is the last chapter");
    }
  };

  const handlePreviousChapter = () => {
    const currentIndex = chapterList.findIndex(
      (chapter) => chapter.chapter_id === id
    );
    if (currentIndex > 0) {
      const prevChapterId = chapterList[currentIndex - 1].chapter_id;
      router.push(`/comics/chapter/${prevChapterId}`);
    } else {
      console.log("This is the first chapter");
    }
  };

  const handleChapterChange = (chapterId: string) => {
    router.push(`/comics/chapter/${chapterId}`);
  };

  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
    if (!isPickerVisible && id) {
      const index = chapterList.findIndex(
        (chapter) => chapter.chapter_id === id
      );
      if (index !== -1) {
        chapterFlatListRef.current?.scrollToIndex({ index, animated: true });
      }
    }
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const height =
      SCREEN_WIDTH *
      (imageSizes[index]?.height / imageSizes[index]?.width || 1);
    return (
      <Image
        source={{ uri: item.image_file }}
        style={[
          styles.image,
          {
            width: SCREEN_WIDTH,
            height: height,
          },
        ]}
        resizeMode="contain"
      />
    );
  };

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
      <View style={styles.container}>
        <SkeletonLoader style={styles.chapterTitle} />
        {[...Array(5)].map((_, index) => (
          <SkeletonLoader
            key={index}
            style={{ ...styles.image, height: 200 }}
          />
        ))}
      </View>
    );
  }

  const navigationButtons: NavButton[] = [
    { icon: "chevron-back", onPress: handlePreviousChapter },
    { icon: "list", onPress: togglePicker },
    { icon: "chevron-forward", onPress: handleNextChapter },
    { icon: "arrow-up", onPress: scrollToTop },
  ];

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={chapterData.chapter_images}
          renderItem={renderItem}
          keyExtractor={(item) => item.image_page + item.image_file}
          ListHeaderComponent={() => (
            <ThemedText style={styles.chapterTitle}>
              {i18n.t("chapter")}
              {chapterData.chapter_name}
            </ThemedText>
          )}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContainer}
        />
        <NavigationBar buttons={navigationButtons} />
      </View>
      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={togglePicker}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <ChapterFlatList
              ref={chapterFlatListRef}
              data={chapterList}
              renderItem={({ item }: { item: ChapterData }) => (
                <TouchableOpacity
                  style={styles.chapterItem}
                  onPress={() => {
                    console.log("Selected chapter:", item.chapter_id);
                    handleChapterChange(item.chapter_id || "");
                    togglePicker();
                  }}
                >
                  <Text
                    style={
                      item.chapter_id === id ? styles.selectedChapter : null
                    }
                  >
                    {i18n.t("chapter")} {item.chapter_name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.chapter_api_data.toString()}
              style={styles.chapterList}
            />
            <TouchableOpacity style={styles.closeButton} onPress={togglePicker}>
              <Text style={styles.closeButtonText}>{i18n.t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100, // Ensure content is not hidden behind the navigation bar
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  chapterList: {
    maxHeight: "90%",
  },
  chapterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  selectedChapter: {
    fontWeight: "bold",
    color: "blue",
  },
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
  closeButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
