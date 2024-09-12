import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chapter, ChapterData } from "@/types/comic";
import { getChapterId } from "@/utils/chapter.helper";
import { RootState } from ".";

interface ChaptersState {
  list: ChapterData[];
  currentIndex: string;
}

const initialState: ChaptersState = {
  list: [],
  currentIndex: "",
};

const chaptersSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {
    setChapters: (state, action: PayloadAction<Chapter[]>) => {
      const listChapters = action.payload[0].server_data.map((c) => {
        const chapterId = getChapterId(c.chapter_api_data);
        return { ...c, chapter_id: chapterId };
      });
      state.list = listChapters;
    },
    setCurrentChapterId: (state, action: PayloadAction<string>) => {
      state.currentIndex = action.payload;
    },
  },
});

export const { setChapters, setCurrentChapterId } = chaptersSlice.actions;
export default chaptersSlice.reducer;

export const selectChapterList = (state: RootState) => state.chapters.list;
