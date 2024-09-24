import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HistoriesResponse, History } from "@/types/history";
import CustomCardComic from "@/components/CustomCardComic";
import ApiService from "@/api";
import { useRouter } from "expo-router";
import i18n from "@/utils/languages/i18n";
import { cdnImage } from "@/constants/Api";
import {
  selectHistories,
  selectRefreshHistories,
  setHistories,
} from "@/store/historiesSlice";
import { getAccessToken } from "@/utils/secure.store.helper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { selectAccessToken } from "@/store/authSlice";
import { ThemedView } from "@/components/ThemedView";

export default function Histories() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const histories = useSelector(selectHistories);
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const refresh = useSelector(selectRefreshHistories);
  const apiService = new ApiService();
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    fetchHistories();
  }, [refresh, accessToken]);

  const fetchHistories = async () => {
    console.log("load histories");
    if (accessToken) {
      const response: HistoriesResponse = await apiService.getHistories(page);
      dispatch(setHistories(response.rows));
    } else {
      router.replace("/auth/login");
    }
  };

  const renderItem = ({ item }: { item: History }) => (
    <CustomCardComic
      title={item.name}
      thumbnail={`${cdnImage}/${item.thumbnail}`}
      currentChapter={`${i18n.t("read_to")} ${item.latest_read_chapter}`}
      slug={item.slug}
      size="medium"
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={histories}
        renderItem={renderItem}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        contentContainerStyle={styles.childContainer}
        columnWrapperStyle={styles.row}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={21}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  childContainer: {
    gap: 8,
    padding: 8,
  },
  row: {
    justifyContent: "space-between",
  },
});
