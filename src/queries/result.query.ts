import {
  createRemoveWishlist,
  createSaveResult,
  fetchCourseDetails,
  fetchresults,
  removeSaveResult,
} from "@/api/services/resultService";
import type {
  CourseResponse,
  DegreePayload,
  ResultPayload,
  ResultResponse,
} from "@/types/result";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {toast} from "sonner";

export const useResults = (payload: ResultPayload) => {
  return useQuery<ResultResponse>({
    queryKey: ["results", payload.session_id],
    queryFn: () => fetchresults(payload),
    enabled: !!payload.session_id,
    retry: false,
  });
};

export const useCourseDetails = (payload: DegreePayload) => {
  return useQuery<CourseResponse>({
    queryKey: ["results", payload.course_id, payload.lang],
    queryFn: () => fetchCourseDetails(payload),
    enabled: !!payload.course_id,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useWishlistToggle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRemoveWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },

    onError: (error) => {
      toast.error("Wishlist error");
      console.error("Wishlist error:", error);
    },
  });
};
export const useCreateSaveResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSaveResult,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["save-results"],
      });
    },

    onError: (error) => {
      console.error("Wishlist error:", error);
    },
  });
};

export const useDeleteSaveResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeSaveResult,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["save-results"],
      });
    },

    onError: (error) => {
      console.error("Wishlist error:", error);
    },
  });
};
