

import type { DegreePayload, ResultPayload, SessionPayload, wishlistPayload } from "@/types/result";
import axiosPrivate from "../axiosPrivate";
import type { RemoveSaveResultPayload } from "@/types/profile";




export const fetchresults = async (payload:ResultPayload) => {
  const res = await axiosPrivate.post('/result',payload);
  return res.data;
};

export const createRemoveWishlist = async (payload: wishlistPayload) => {
  const res = await axiosPrivate.post('/wishlist-toggle', payload);
  return res.data;
};

export const fetchCourseDetails = async (payload: DegreePayload) => {
  const res = await axiosPrivate.post('/course-details',payload);
  return res.data;
};
export const createSaveResult = async (payload: SessionPayload) => {
  const res = await axiosPrivate.post('/result-save',payload);
  return res.data;
};
export const removeSaveResult = async (payload: RemoveSaveResultPayload) => {
  const res = await axiosPrivate.post('/result-remove',payload);
  return res.data;
};
