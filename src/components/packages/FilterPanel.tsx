import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import type { WnppOwner, WnppSearchParams, WnppType } from "@/types/wnpp";
import { useState } from "react";

const PACKAGE_TYPES: { value: WnppType; label: string }[] = [
  { value: "O", label: "O - Orphaned" },
  { value: "RFA", label: "RFA - Request for Adoption" },
  { value: "RFH", label: "RFH - Request for Help" },
  { value: "RFP", label: "RFP - Request for Package" },
  { value: "ITA", label: "ITA - Intent to Adopt" },
  { value: "ITP", label: "ITP - Intent to Package" },
];

function toWnppOwner(value: string): WnppOwner | undefined {
  if (value === "true" || value === "false" || value === "all") {
    return value;
  }
  return undefined;
}

interface FilterPanelProps {
  filters: WnppSearchParams;
  setFilters: (filters: WnppSearchParams) => void;
  onReset: () => void;
}

export default function FilterPanel({
  filters,
  setFilters,
  onReset,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<WnppSearchParams>(filters);
  const [types, setTypes] = useState<WnppType[]>([]);

  const selectedTypes = Array.isArray(filters.type)
    ? filters.type
    : filters.type === undefined
    ? []
    : [filters.type];
  const hasActiveFilters =
    filters.q || selectedTypes.length > 0 || filters.owner !== "all";

  const handleTypeToggle = (typeValue: WnppType) => {
    const newTypes = types.includes(typeValue)
      ? types.filter((t) => t !== typeValue)
      : [...types, typeValue];

    setTypes(newTypes);

    setFilters({
      ...filters,
      type: newTypes.length === 0 ? undefined : newTypes,
    });
  };

  const handleOnClear = () => {
    setLocalFilters({ owner: "all" });

    setTypes([]);

    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border-2 border-slate-200 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-5 h-5 text-[#D70A53]" />

        <h2 className="text-lg font-bold text-[#2B5672] uppercase tracking-wide">
          Filter Packages
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            handleOnClear();
          }}
          className={`text-slate-500 hover:text-slate-700 ${
            hasActiveFilters ? "" : "invisible pointer-events-none"
          }`}
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search project or description..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="pl-10 border-slate-300 focus:border-[#D70A53] focus:ring-[#D70A53]/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-700">
              Package Type
            </div>
            <div className="space-y-2">
              {PACKAGE_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={types.includes(type.value)}
                    onCheckedChange={() => handleTypeToggle(type.value)}
                    className="border-slate-300"
                  />
                  <label
                    htmlFor={type.value}
                    className="text-sm text-slate-700 cursor-pointer select-none"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-700">
              Owner Status
            </div>
            <Select
              value={localFilters.owner}
              onValueChange={(value) => {
                setLocalFilters({ ...localFilters, owner: toWnppOwner(value) });
                setFilters({ ...filters, owner: toWnppOwner(value) });
              }}
            >
              <SelectTrigger className="border-slate-300 focus:border-[#D70A53] focus:ring-[#D70A53]/20">
                <SelectValue placeholder="Owner Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                <SelectItem value="true">With Owner</SelectItem>
                <SelectItem value="false">Without Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
