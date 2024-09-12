import { ComicTypes } from "@/utils/enums/comic.type";
import { request } from "./axios";
import { Category, Comic } from "@/types/comic";
import { ChapterResponse } from "@/types/chapter";

const getHome = async (): Promise<any> => {
  const res = await request.get(`/comics/home`);
  return res;
};

const getComicsByType = async (
  page: number = 1,
  type: string = ComicTypes.New
): Promise<any> => {
  const res = await request.get(
    `/comics?${type ? `type=${type}` : ""}${page ? `&page=${page}` : ""}`
  );
  return res;
};

const getCategories = async (): Promise<Category[]> => {
  const res = await request.get(`/comics/categories`);
  return res.data;
};

const getComicsByCategory = async (
  categorySlug: string,
  page: number = 1
): Promise<any> => {
  const res = await request.get(
    `/comics/categories/${categorySlug}?page=${page}`
  );
  return res.data;
};

const searchComics = async (keyword: string): Promise<any> => {
  const res = await request.get(`/comics/search?keyword=${keyword}`);
  return res.data;
};

const getComicBySlug = async (slug: string): Promise<Comic> => {
  const res = await request.get(`/comics/${slug}`);
  return res.data;
};

const getChapterById = async (chapterId: string): Promise<ChapterResponse> => {
  const res = await request.get(`/comics/chapter/${chapterId}`);
  return res.data;
};

export {
  getHome,
  getComicsByType,
  getCategories,
  searchComics,
  getComicBySlug,
  getChapterById,
  getComicsByCategory,
};
