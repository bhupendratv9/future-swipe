import type { CourseBase } from "./result";


export interface FetchWishlistPayload {
    lang?: string;
    wishlist_id: string;
}
export interface SaveResultPayload {
    lang?: string;
    result_id?: string
}
export interface RemoveSaveResultPayload {

    result_id?: string
}
export interface WishlistData {
    course: CourseBase[];
    category?: {
        id: number;
    };
}

export interface WishlistResponse {
    data: WishlistData;
}

export interface ResultCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  photo: string;
}

export interface SavedResultItem {
  session_id?: string;
  result_id: number;
  created_at: string;
  category: ResultCategory;
  persona: {
    id?: number;
    name?: string;
    slug?: string;
    description?: string;
    photo?: string;
  };
}

export interface SavedResultResponse {
  status: number;
  message: string;
  data: {
    results: SavedResultItem[];
  };
}