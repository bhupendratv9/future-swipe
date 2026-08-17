import { fetchInsights } from "@/api/services/insightService";
import type { InsightPayload, InsightResponse } from "@/types/result";

import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";


export const useInsights = (payload: InsightPayload) => {
    return useQuery<InsightResponse, AxiosError>({
        queryKey: ["results", payload.session_id, payload.lang],
        queryFn: () => fetchInsights(payload),
        enabled: !!payload.session_id, 
        retry: false
    });
};