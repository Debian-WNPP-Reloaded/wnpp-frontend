// src/api/wnpp.ts
import { api } from "./client";
import type {
  WnppPackage,
  WnppSearchParams,
  WnppCountResponse,
} from "../types/wnpp";

function buildQueryString(params: WnppSearchParams): string {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.append("q", params.q);
  }

  if (params.type) {
    const types = Array.isArray(params.type) ? params.type : [params.type];
    types.forEach((t) => searchParams.append("type", t));
  }

  if (params.owner !== undefined) {
    searchParams.append("owner", params.owner.toString());
  }

  if (params.order) {
    searchParams.append("order", params.order);
  }

  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString());
  }

  if (params.offset !== undefined) {
    searchParams.append("offset", params.offset.toString());
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export async function searchWnpp(
  params: WnppSearchParams = {}
): Promise<WnppPackage[]> {
  const queryString = buildQueryString(params);
  return api.get<WnppPackage[]>(`/api/wnpp${queryString}`);
}

export async function countWnpp(
  params: Pick<WnppSearchParams, "type" | "owner"> = {}
): Promise<number> {
  const queryString = buildQueryString(params);
  const result = await api.get<WnppCountResponse>(
    `/api/wnpp/count${queryString}`
  );
  return result.total;
}
