import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../types/comic";
import { RootState } from ".";

interface CategoriesState {
  items: Category[];
  currentCategory: Category | null;
}

const initialState: CategoriesState = {
  items: [],
  currentCategory: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
    setCategory: (state, action: PayloadAction<Category>) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { setCategories, setCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer;

// Selectors
export const getCategories = (state: RootState) => state.categories.items;
export const getCategory = (state: RootState) =>
  state.categories.currentCategory;
