
import type { InsightPayload } from "@/types/result";
import axiosPrivate from "../axiosPrivate";

export const fetchInsights = async (payload:InsightPayload) => {
  const res = await axiosPrivate.post('/insight-view',payload);
  return res.data;
};