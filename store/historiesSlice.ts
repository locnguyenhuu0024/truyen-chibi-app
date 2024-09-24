import { History } from "@/types/history";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface HistoriesState {
  histories: History[];
  refresh: boolean;
}

const initialState: HistoriesState = {
  histories: [],
  refresh: false,
};

const historiesSlice = createSlice({
  name: "histories",
  initialState,
  reducers: {
    addHistory(state, action: PayloadAction<History>) {
      state.histories.push(action.payload);
    },
    removeHistory(state, action: PayloadAction<string | number>) {
      state.histories = state.histories.filter(
        (history) => history.id !== action.payload
      );
    },
    setHistories(state, action: PayloadAction<History[]>) {
      state.histories = action.payload;
    },
    updateHistory(state, action: PayloadAction<History>) {
      const index = state.histories.findIndex(
        (history) => history.slug === action.payload.slug
      );
      if (index !== -1) {
        state.histories[index] = action.payload;
      } else {
        addHistory(action.payload);
      }
    },
    refreshHistories(state, action: PayloadAction<boolean>) {
      state.refresh = action.payload;
    },
  },
});

export const {
  addHistory,
  removeHistory,
  setHistories,
  updateHistory,
  refreshHistories,
} = historiesSlice.actions;
export default historiesSlice.reducer;
export const selectHistories = (state: RootState) => state.histories.histories;
export const selectRefreshHistories = (state: RootState) =>
  state.histories.refresh;
