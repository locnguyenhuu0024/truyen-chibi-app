import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getHome, getComicsByType } from "@/api";
import { ComicTypes } from "@/utils/enums/comic.type";
import { Comic, initialComic } from "@/types/comic";

interface ComicsState {
  homeComics: any[];
  comics: Comic[];
  page: number;
  currentComic: Comic;
  type: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMoreData: boolean;
  error: string | null;
}

const initialState: ComicsState = {
  homeComics: [],
  comics: [],
  page: 1,
  currentComic: initialComic,
  type: "new",
  isLoading: false,
  isLoadingMore: false,
  hasMoreData: true,
  error: null,
};

export const fetchHomeComics = createAsyncThunk(
  "comics/fetchHomeComics",
  async () => {
    const response = await getHome();
    return response.data?.items || [];
  }
);

export const fetchComicsByType = createAsyncThunk(
  "comics/fetchComicsByType",
  async ({ page, type }: { page: number; type: string }) => {
    const response = await getComicsByType(page, type);
    return response.data?.items || [];
  }
);

const comicsSlice = createSlice({
  name: "comics",
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
      state.page = 1;
      state.comics = [];
      state.hasMoreData = true;
    },
    setCurrentComic: (state, action: PayloadAction<Comic>) => {
      state.currentComic = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeComics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHomeComics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.homeComics = action.payload;
      })
      .addCase(fetchHomeComics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch home comics";
      })
      .addCase(fetchComicsByType.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(fetchComicsByType.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        if (state.page === 1) {
          state.comics = action.payload;
        } else {
          const newComics = action.payload;
          const existingIds = new Set(state.comics.map((comic) => comic._id));
          const uniqueNewComics = newComics.filter(
            (comic: any) => !existingIds.has(comic._id)
          );
          state.comics = [...state.comics, ...uniqueNewComics];
        }
        state.hasMoreData = action.payload.length > 0;
        state.page += 1;
      })
      .addCase(fetchComicsByType.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.error.message || "Failed to fetch comics";
      });
  },
});

export const { setType, setCurrentComic } = comicsSlice.actions;
export const selectCurrentComic = (state: { comics: ComicsState }) =>
  state.comics.currentComic;
export default comicsSlice.reducer;
