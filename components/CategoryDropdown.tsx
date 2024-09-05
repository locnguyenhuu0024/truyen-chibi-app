import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCategories } from "@/api";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CategoryDropdown = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleDropdown}>
        <Text style={styles.headerText}>
          {selectedCategory ? selectedCategory.name : "Select Category"}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {isOpen && (
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => selectCategory(item)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.slug}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  headerText: {
    fontSize: 16,
  },
  list: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopWidth: 0,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default CategoryDropdown;
