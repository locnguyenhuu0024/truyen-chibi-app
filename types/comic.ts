export type Category = {
  id: string;
  _id: string;
  name: string;
  slug: string;
};

export type ChapterData = {
  filename: string;
  chapter_name: string;
  chapter_title: string;
  chapter_api_data: string;
};

export type Chapter = {
  server_name: string;
  server_data: ChapterData[];
};

export type Comic = {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  content: string;
  status: string;
  thumb_url: string;
  sub_docquyen: boolean;
  author: string[];
  category: Category[];
  chapters: Chapter[];
  updatedAt: string;
};
