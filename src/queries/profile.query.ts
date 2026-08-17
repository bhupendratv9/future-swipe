import { fetchSaveResults, fetchWishlists } from "@/api/services/profileService";
import type { FetchWishlistPayload, SavedResultResponse, SaveResultPayload, WishlistResponse } from "@/types/profile";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getGameStatusData } from "./get-game-status-query";

export const useWishlists = (payload: FetchWishlistPayload) => {
  return useQuery<WishlistResponse, AxiosError>({
    queryKey: ["wishlist", payload.lang, payload.wishlist_id],
    queryFn: () => fetchWishlists( payload ),
    retry: false,
    refetchOnWindowFocus: false,
  });
};


export const useSaveResults = (payload: SaveResultPayload) => {
  return useQuery<SavedResultResponse,AxiosError>({
    queryKey: ["save-results", payload.lang, payload.result_id ?? "all"],
    queryFn: () => fetchSaveResults( payload ),
    retry: false,
    refetchOnWindowFocus: false,
    // enabled: !!payload.result_id,
  });
};

  export const useCheckGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getGameStatusData,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkgame"],
      });
    },

    onError: (error) => {
     
      console.error("Check Game error:", error);
    },
  });
};