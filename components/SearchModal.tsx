import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import CustomCardComic from "@/components/CustomCardComic";
import ApiService from "@/api";
import { cdnImage } from "@/constants/Api";
import i18n from "@/utils/languages/i18n";
import { Ionicons } from "@expo/vector-icons";
import { useDebounce } from "@/hooks/useDebounce"; // Tạo hook này

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.8; // 80% của chiều cao màn hình

interface SearchModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const apiService = new ApiService();

  const handleSearch = useCallback(async (term: string) => {
    if (term.trim()) {
      try {
        const results = await apiService.searchComics(term);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching comics:", error);
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, handleSearch]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <CustomCardComic
        key={item.slug}
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

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>{i18n.t("search")}</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={i18n.t("search_placeholder")}
          />
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.slug}
            numColumns={2}
            contentContainerStyle={styles.resultsList}
            columnWrapperStyle={styles.row}
            extraData={searchResults}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: MODAL_HEIGHT,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  resultsList: {
    gap: 8,
    padding: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  comicCardContainer: {
    width: (SCREEN_WIDTH - 56) / 2, // Adjust the width based on screen size and padding
    marginBottom: 8,
  },
});

export default SearchModal;
