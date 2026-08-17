import axiosPublic from "@/api/axiosPublic.ts";
import {useMutation} from "@tanstack/react-query";

export const submitMcq = async (data:any) => {
  const res = await axiosPublic.post("/submit-mcq",data)
  return res
}

export const useSubmitMcqMutation = () => {
  return useMutation({
    mutationFn: (data:any) => submitMcq(data),
  })
};