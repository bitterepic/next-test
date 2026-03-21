import {
  type GetCategoryQuery,
  type GetHomeScreensQuery,
  type GetOriginalVideoQuery,
  type GetVideoCommentsQuery,
} from '@/lib/graphql/generated/graphql';

export type HomeScreen = GetHomeScreensQuery['homeScreens'][number];
export type Comments = GetVideoCommentsQuery['videoComments'];
export type Video = GetOriginalVideoQuery['originalVideo'];
export type Category = GetCategoryQuery['category'];

export interface ActiveVideo {
  // Indicated the video is selected
  id: string;
  // Lazy loaded payloads
  comments?: Comments;
  video?: Video;
}

export interface ActiveCategory {
    // Indicates the category is selected
    id: string;
    // Lazy loaded payloads
    category?: Category;
}

export interface State {
  homeScreens: HomeScreen[];
  reloading: boolean;
  activeVideo?: ActiveVideo;
  activeCategory?: ActiveCategory;
}
