import axiosPrivate from "@/api/axiosPrivate.ts";
import { useMutation } from "@tanstack/react-query";

const deleteAccountFunction = async (payload: FormData) => {
  try {
    const res = await axiosPrivate.post("/delete-account", payload);
    // Clear token after account deletion
    localStorage.removeItem("access_token");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => deleteAccountFunction(data),
  });
};
