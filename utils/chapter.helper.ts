export const getChapterId = (chapterUrl: string) => {
  return chapterUrl.match(/\/([^\/]+)$/)?.[1] || "";
};
