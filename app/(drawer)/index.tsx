import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import i18n from "@/utils/languages/i18n";
import CustomCarousel from "@/components/CustomCarousel";
import CustomCardComic from "@/components/CustomCardComic";
import { useEffect, useState, useCallback, memo } from "react";
import { getHome, getComicsByType } from "@/api";
import { cdnImage } from "@/constants/Api";
import { ComicTypes } from "@/utils/enums/comic.type";
import LoadingIndicator from "@/components/LoadingIndicator";
import Skeleton from "@/components/Skeleton";
import { useRef } from "react";
import { NavigationBar, NavButton } from "@/components/NavigationBar";
import { Category } from "@/types/comic";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  getCategories,
  getCategory,
  setCategory,
} from "@/store/categoriesSlice";

const MemoizedCustomCardComic = memo(CustomCardComic);

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);
  const currentCategory = useSelector(getCategory);
  const [homeComics, setHomeComics] = useState<any[]>([]);
  const [comics, setComics] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const loadingRef = useRef(false);
  const onEndReachedCalledDuringMomentumRef = useRef(false);
  const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);

  useEffect(() => {
    getHomeData();
  }, []);

  useEffect(() => {
    getComicsByTypeData(page, ComicTypes.New);
  }, [page]);

  const getHomeData = () => {
    setIsLoading(true);
    getHome()
      .then((res) => {
        setHomeComics(res.data?.items || []);
      })
      .catch((err) => console.error("Error fetching home data:", err))
      .finally(() => setIsLoading(false));
  };

  const getComicsByTypeData = useCallback((page: number, type: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoadingMore(true);
    getComicsByType(page, type)
      .then((res) => {
        const newComics = res.data?.items || [];
        if (page === 1) {
          setComics(newComics);
        } else {
          setComics((prevComics) => {
            const existingIds = new Set(prevComics.map((comic) => comic._id));
            const uniqueNewComics = newComics.filter(
              (comic: { _id: string }) => !existingIds.has(comic._id)
            );
            return [...prevComics, ...uniqueNewComics];
          });
        }
        setHasMoreData(newComics.length > 0);
      })
      .catch((err) => console.error("Error fetching comics by type:", err))
      .finally(() => {
        setIsLoadingMore(false);
        loadingRef.current = false;
      });
  }, []);

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

  const renderCarouselItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <MemoizedCustomCardComic
        key={`${item._id}-${index}`}
        title={item.name}
        currentChapter={`${i18n.t("chapter")} ${
          item?.chaptersLatest?.[0]?.chapter_name
        }`}
        thumbnail={`${cdnImage}/${item.thumb_url}`}
        size="small"
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

  const renderHeader = useCallback(
    () => (
      <>
        <View style={{ width: "100%", marginLeft: 36 }}>
          <CustomCarousel
            data={homeComics}
            carouselWidth={360}
            loop={true}
            autoPlay={true}
            renderItem={renderCarouselItem}
          />
        </View>
        <ThemedText style={styles.title}>{i18n.t("new_updated")}</ThemedText>
      </>
    ),
    [homeComics, renderCarouselItem]
  );

  const toggleCategoryPicker = () =>
    setIsCategoryPickerVisible(!isCategoryPickerVisible);

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

  const navigationButtons: NavButton[] = [
    { icon: "home", onPress: () => router.push("/") },
    { icon: "list", onPress: toggleCategoryPicker },
    { icon: "time", onPress: () => {} },
  ];

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
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.row}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={21}
        ListFooterComponent={
          isLoadingMore ? (
            renderSkeletonItem
          ) : !hasMoreData ? (
            <ThemedText style={styles.endMessage}>
              {i18n.t("no_more_comics")}
            </ThemedText>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? null : (
            <ThemedText>{i18n.t("no_comics_found")}</ThemedText>
          )
        }
      />
      <NavigationBar buttons={navigationButtons} />
      <Modal
        visible={isCategoryPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCategoryPicker}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <FlatList
              data={categories}
              renderItem={({ item }: { item: Category }) => (
                <TouchableOpacity
                  style={styles.CategoryItem}
                  onPress={() => handleCategoryChange(item)}
                >
                  <Text
                    style={
                      item.slug === currentCategory?.slug
                        ? styles.selectedCategory
                        : null
                    }
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
              style={styles.CategoryList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleCategoryPicker}
            >
              <ThemedText style={styles.closeButtonText}>
                {i18n.t("close")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  childContainer: {
    gap: 8,
    padding: 8,
  },
  comicCardContainer: {
    flex: 1,
    marginBottom: 8,
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
  CategoryList: {
    maxHeight: "90%",
  },
  CategoryItem: {
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
