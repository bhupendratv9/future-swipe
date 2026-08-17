import type { SubmitSwipePayload, SwipePayload } from "@/types/swipe";
import axiosPublic from "../axiosPublic";
import type { ResultPayload } from "@/types/result";


export const fetchSwipeCards = async (payload: SwipePayload) => {
  const res = await axiosPublic.post('/cards',payload);
  return res.data;
};
export const fetchNextSwipeCards = async (payload: ResultPayload) => {
  const res = await axiosPublic.post('/next-cards',payload);
  return res.data;
};

export const submitSwipes = async (payload: SubmitSwipePayload) => {
  const res = await axiosPublic.post("/submit-game", payload);
  return res.data;
};