import type { FetchWishlistPayload, SaveResultPayload } from "@/types/profile";
import axiosPrivate from "../axiosPrivate";


export const fetchWishlists = async (payload:FetchWishlistPayload) => {
  const res = await axiosPrivate.post('/wishlist-get',payload);
  return res.data;
};
export const fetchSaveResults = async (payload: SaveResultPayload) => {
  
    const res = await axiosPrivate.post('/result-list', payload);
    return res.data;
  
};