import {useQuery} from "@tanstack/react-query";
import {getProfile} from "@/api/services/get-profile.ts";


export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};