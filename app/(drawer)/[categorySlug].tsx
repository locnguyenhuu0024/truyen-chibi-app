import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import CustomCardComic from "@/components/CustomCardComic";
import ApiService from "@/api";
import { cdnImage } from "@/constants/Api";
import i18n from "@/utils/languages/i18n";
import LoadingIndicator from "@/components/LoadingIndicator";
import Skeleton from "@/components/Skeleton";

const MemoizedCustomCardComic = React.memo(CustomCardComic);

export default function CategoryScreen() {
  const { categorySlug, title } = useLocalSearchParams();
  const navigation = useNavigation();
  const [comics, setComics] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const loadingRef = useRef(false);
  const onEndReachedCalledDuringMomentumRef = useRef(false);
  const apiService = new ApiService();

  useEffect(() => {
    navigation.setOptions({ title: title || "Action" });
  }, [navigation, title]);

  useEffect(() => {
    getComicsByCategoryData(page);
  }, [page, categorySlug]);

  const getComicsByCategoryData = useCallback(
    (page: number) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoadingMore(true);
      apiService
        .getComicsByCategory((categorySlug as string) || "action", page)
        .then((res) => {
          const comics = res || [];
          if (page === 1) {
            setComics(comics);
          } else {
            setComics((prevComics) => {
              const existingIds = new Set(prevComics.map((comic) => comic._id));
              const uniqueNewComics = comics.filter(
                (comic: { _id: string }) => !existingIds.has(comic._id)
              );
              return [...prevComics, ...uniqueNewComics];
            });
          }
          setHasMoreData(comics.length > 0);
        })
        .catch((err) =>
          console.error("Error fetching comics by category:", err)
        )
        .finally(() => {
          setIsLoading(false);
          setIsLoadingMore(false);
          loadingRef.current = false;
        });
    },
    [categorySlug]
  );

  const onEndReached = useCallback(() => {
    if (!onEndReachedCalledDuringMomentumRef.current) {
      if (!isLoadingMore && hasMoreData && !loadingRef.current) {
        setPage((prevPage) => prevPage + 1);
      }
      onEndReachedCalledDuringMomentumRef.current = true;
    }
  }, [isLoadingMore, hasMoreData]);

  const onMomentumScrollBegin = useCallback(() => {
    onEndReachedCalledDuringMomentumRef.current = false;
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <MemoizedCustomCardComic
        key={`${item._id}-${index}`}
        title={item.name}
        currentChapter={`${i18n.t("chapter")} ${
          item?.chaptersLatest?.[0]?.chapter_name
        }`}
        thumbnail={`${cdnImage}/${item.thumb_url}`}
        slug={item.slug}
      />
    ),
    []
  );

  const renderSkeletonItem = useCallback(
    () => (
      <View style={styles.skeletonContainer}>
        <Skeleton width={150} height={200} style={styles.skeletonImage} />
        <Skeleton width={130} height={20} style={styles.skeletonText} />
        <Skeleton width={100} height={16} style={styles.skeletonText} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any, index: number) => `${item._id}-${index}`,
    []
  );

  if (isLoading && comics.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comics}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={onMomentumScrollBegin}
        contentContainerStyle={styles.childContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={21}
        ListFooterComponent={
          isLoadingMore ? renderSkeletonItem : !hasMoreData ? <></> : null
        }
        ListEmptyComponent={
          isLoading ? null : (
            <ThemedText>{i18n.t("no_comics_found")}</ThemedText>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  childContainer: {
    gap: 8,
    padding: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  skeletonContainer: {
    flex: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  skeletonImage: {
    marginBottom: 8,
  },
  skeletonText: {
    marginBottom: 4,
  },
  endMessage: {
    textAlign: "center",
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  categoryList: {
    maxHeight: "90%",
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedCategory: {
    fontWeight: "bold",
    color: "blue",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontWeight: "bold",
  },
});
