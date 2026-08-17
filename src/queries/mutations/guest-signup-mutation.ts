import axiosPublic from "@/api/axiosPublic.ts";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";


export const guestSignupMutation = async (payload:FormData) => {
  try {
    const res = await axiosPublic.post("/login", payload);

    // Save token to localStorage for Bearer auth
    const token = res.data?.data?.access_token;
    if (token) {
      localStorage.setItem("access_token", token);
    }

    return res.data;
  }
  catch (error) {
    toast.error((error as {response: {data: {message: string}}}).response?.data?.message || "Signup failed");
    throw error;
  }
};

export const useGuestSignupMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => guestSignupMutation(data),
  })
};