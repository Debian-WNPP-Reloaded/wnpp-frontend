export type WnppType = "ALL" | "O" | "ITP" | "RFP" | "ITA" | "RFA";
export type WnppOwner = "all" | "false" | "true";
export type WnppOrder = "arrival" | "installs" | "dust_days";

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
  owner?: WnppOwner;
  order?: WnppOrder;
  limit?: number;
  offset?: number;
}

export interface WnppCountResponse {
  total: number;
}
