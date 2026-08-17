import axiosPublic from "@/api/axiosPublic.ts";
import {useQuery} from "@tanstack/react-query";
import {getAppLanguage} from "@/lib/getAppLanguage.ts";


export const getMcqData = async (sessionId: string | number) => {
  const response = await axiosPublic.post("/questions",{"session_id" :sessionId, "lang":getAppLanguage()});
  return response.data;
}

export const useGetMcqQuery = (sessionId: string | number) => useQuery({
  queryKey: ["questions"],
  queryFn: () => getMcqData(sessionId),
});