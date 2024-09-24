import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Category } from "@/types/comic";

interface CategoryPickerModalProps {
  visible: boolean;
  categories: Category[];
  currentCategory: Category | null;
  onCategoryChange: (category: Category) => void;
  onClose: () => void;
}

const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  visible,
  categories,
  currentCategory,
  onCategoryChange,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <FlatList
            data={categories}
            renderItem={({ item }: { item: Category }) => (
              <TouchableOpacity
                style={styles.CategoryItem}
                onPress={() => onCategoryChange(item)}
              >
                <ThemedText
                  style={
                    item.slug === currentCategory?.slug
                      ? styles.selectedCategory
                      : null
                  }
                >
                  {item.name}
                </ThemedText>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            style={styles.CategoryList}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default CategoryPickerModal;
