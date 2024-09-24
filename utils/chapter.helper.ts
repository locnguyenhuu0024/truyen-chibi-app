import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const getChapterId = (chapterUrl: string) => {
  return chapterUrl.match(/\/([^\/]+)$/)?.[1] || "";
};

export const getHeightImage = (width: number, height: number) =>
  SCREEN_WIDTH * (height / width || 1);
