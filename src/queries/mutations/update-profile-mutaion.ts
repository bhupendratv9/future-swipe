import { useMutation } from "@tanstack/react-query";
import axiosPrivate from "@/api/axiosPrivate.ts";

export const updateProfileFunction = async (payload: FormData) => {
  try {
    const res = await axiosPrivate.post("/update-profile", payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => updateProfileFunction(data),
  });
};
