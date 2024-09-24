export type ChapterResponse = {
  chapter_images: Image[];
  chapter_name: string;
  comic_name: string;
};

export type Image = {
  image_page: number;
  image_file: string;
  image_size: ImageSize;
};

export type ChapterItem = {
  _id: string;
  comic_name: string;
  chapter_name: string;
  chapter_title: string;
  chapter_path: string;
  chapter_image: Image[];
};

export type Chapter = {
  domain_cdn: string;
  item: ChapterItem;
};

export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageDetails extends ImageSize {
  url: string;
}
