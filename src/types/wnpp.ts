// src/types/wnpp.ts
export type WnppType = "O" | "ITP" | "RFP" | "ITA" | "RFA";

export interface WnppPackage {
  bug_id: number;
  type: WnppType;
  source: string;
  wnpp_package: string;
  arrival: string;
  submitter: string;
  owner: string | null;
  owner_name: string | null;
  owner_email: string | null;
  last_modified: string;
  title: string;
  installs: number | null;
  users: number | null;
}

export interface WnppSearchParams {
  q?: string;
  type?: WnppType | WnppType[];
  owner?: boolean;
  order?: "arrival" | "installs" | "dust_days";
  limit?: number;
  offset?: number;
}

export interface WnppCountResponse {
  total: number;
}
