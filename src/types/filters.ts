import type { WnppType } from "./wnpp";

export interface Filters {
  search: string;
  type: "all" | WnppType | WnppType[];
  ownerStatus: "all" | "with" | "without";
}
