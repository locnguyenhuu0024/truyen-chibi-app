import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  Pressable,
  Button,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getComicBySlug } from "@/api";
import { ChapterData, Comic } from "@/types/comic";
import { cdnImage } from "@/constants/Api";
import { useNavigation } from "@react-navigation/native";
import i18n from "@/utils/languages/i18n";
import { Link } from "expo-router";
import { useDispatch } from "react-redux";
import { setChapters } from "@/store/chaptersSlice";
import { getChapterId } from "@/utils/chapter.helper";

type SectionItem = Comic | ChapterData;

export default function ComicDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { slug, title } = useLocalSearchParams();
  const [comicDetails, setComicDetails] = useState<Comic | null>(null);

  useEffect(() => {
    async function fetchComicDetails() {
      const response = await getComicBySlug(slug as string);
      setComicDetails(response);
      dispatch(setChapters(response.chapters));
    }
    fetchComicDetails();
  }, [slug]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation, title]);

  const handleReadFromStart = () => {
    if (comicDetails && comicDetails.chapters[0].server_data.length > 0) {
      const firstChapter = comicDetails.chapters[0].server_data[0];
      const chapterId = getChapterId(firstChapter.chapter_api_data);
      router.push({
        pathname: "/comics/chapter/[id]",
        params: {
          id: chapterId,
        },
      });
    }
  };

  const handleReadLatestChapter = () => {
    if (comicDetails && comicDetails.chapters[0].server_data.length > 0) {
      const latestChapter =
        comicDetails.chapters[0].server_data[
          comicDetails.chapters[0].server_data.length - 1
        ];
      const chapterId = getChapterId(latestChapter.chapter_api_data);
      router.push({
        pathname: "/comics/chapter/[id]",
        params: {
          id: chapterId,
        },
      });
    }
  };

  if (!comicDetails) {
    return <Text>Loading...</Text>;
  }

  const sections: Array<{ title: string; data: SectionItem[] }> = [
    {
      title: "Info",
      data: [comicDetails],
    },
    {
      title: "Chapters",
      data: comicDetails.chapters[0].server_data,
    },
  ];

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      keyExtractor={(item: SectionItem, index) =>
        "chapter_name" in item ? item.chapter_api_data : index.toString()
      }
      renderItem={({
        item,
        section,
      }: {
        item: SectionItem;
        section: { title: string };
      }) => {
        if (section.title === "Info" && "thumb_url" in item) {
          return (
            <>
              <View style={styles.header}>
                <Image
                  source={{ uri: `${cdnImage}/${item.thumb_url}` }}
                  style={styles.thumbnail}
                />
                <View style={styles.info}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.author}>
                    {i18n.t("author")}: {item.author.join(", ")}
                  </Text>
                  <Text style={styles.status}>
                    {i18n.t("status")}: {item.status}
                  </Text>
                  <Text style={styles.categories}>
                    {i18n.t("description")}:{" "}
                    {item.category.map((cat) => cat.name).join(", ")}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={handleReadFromStart}
                >
                  <Text style={styles.secondaryButtonText}>
                    {i18n.t("read_at_beginning")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleReadLatestChapter}
                >
                  <Text style={styles.primaryButtonText}>
                    {i18n.t("read_new_chap")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.description}>
                <Text style={styles.sectionTitle}>{i18n.t("description")}</Text>
                <Text>
                  {item.content?.replace("<p>", "").replace("</p>", "")}
                </Text>
              </View>
            </>
          );
        } else if ("chapter_name" in item) {
          return (
            <Link
              href={{
                pathname: "/comics/chapter/[id]",
                params: {
                  id: getChapterId(item.chapter_api_data),
                },
              }}
              asChild
            >
              <Pressable style={styles.chapterItem}>
                <Text>Chương {item.chapter_name}</Text>
              </Pressable>
            </Link>
          );
        }
        return null;
      }}
      renderSectionHeader={({ section: { title } }) =>
        title === "Chapters" ? (
          <Text style={styles.sectionTitle}>Danh sách chương</Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    padding: 16,
  },
  thumbnail: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    marginBottom: 4,
  },
  categories: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  chapterItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttonContainer: {
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    columnGap: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#E5E5EA",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
