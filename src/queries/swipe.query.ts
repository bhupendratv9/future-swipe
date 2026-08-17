
import { fetchNextSwipeCards, fetchSwipeCards, submitSwipes } from "@/api/services/swipeCardService";
import type { ResultPayload } from "@/types/result";


import { useMutation, useQuery } from "@tanstack/react-query";

export type swipeCardPayload = {
  lang: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
}

export const useSwipeCards = (payload: swipeCardPayload) => {
  return useQuery({
    queryKey: ["swipeCards", payload.lang],
    queryFn: () => fetchSwipeCards(payload),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
export const useNextSwipeCards = (payload: ResultPayload) => {
  return useQuery({
    queryKey: ['swipeNextCards', payload.session_id, payload.lang],
    queryFn: () => fetchNextSwipeCards(payload),
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export const useSubmitSwipes = () => {
  return useMutation({
    mutationFn: submitSwipes,

    onSuccess: () => {
      //  clear store after successful submit
  
    },

    onError: (error) => {
      console.error("Submit failed:", error);
    },
  });
};

