export type HistorySaveRequest = {
  user_id?: number;
  slug: string;
  thumbnail?: string;
  latest_read_chapter?: string;
  latest_read_chapter_id: string;
  name: string;
};

export type History = {
  user_id?: number;
  slug: string;
  thumbnail?: string;
  read_chapter_ids: string[];
  latest_read_chapter?: string;
  latest_read_chapter_id?: string;
  id?: number;
  name: string;
};

export type HistoriesResponse = {
  rows: History[];
  count: number;
};
