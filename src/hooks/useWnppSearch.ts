// src/hooks/useWnppSearch.ts
import { useQuery } from "@tanstack/react-query";
import { searchWnpp, countWnpp } from "../api/wnpp";
import type { WnppSearchParams } from "../types/wnpp";

export function useWnppSearch(params: WnppSearchParams) {
  return useQuery({
    queryKey: ["wnpp", params],
    queryFn: () => searchWnpp(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWnppCount(
  params: Pick<WnppSearchParams, "type" | "owner"> = {}
) {
  return useQuery({
    queryKey: ["wnpp-count", params],
    queryFn: () => countWnpp(params),
    staleTime: 5 * 60 * 1000,
  });
}
