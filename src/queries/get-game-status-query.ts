import axiosPublic from "@/api/axiosPublic.ts";
import {useSwipeStore} from "@/store/swipeStore.ts";

export const getGameStatusData = async () => {
  const { sessionId } = useSwipeStore.getState();
  const res = await axiosPublic.post("/check-game", {session_id: sessionId});
  return res.data;
};