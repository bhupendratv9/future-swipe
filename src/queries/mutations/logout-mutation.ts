import axiosPrivate from "@/api/axiosPrivate.ts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {useRouter} from "@tanstack/react-router";
import {queryClient} from "@/lib/queryClient.ts";

const logoutFunction = async () => {
  try {
    const res = await axiosPrivate.get("/logout");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useLogoutMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: logoutFunction,
    onSuccess: () => {
      // Remove token from localStorage
      localStorage.removeItem("access_token");

      queryClient.removeQueries({queryKey:["profile"]})
      toast.success("Logged out successfully");
      router.navigate({to:"/dashboard"})
    },
    onError: () => {
      // Still remove token on error (server might have already invalidated it)
      localStorage.removeItem("access_token");
      toast.error("Logout failed");
    },
  })
};
