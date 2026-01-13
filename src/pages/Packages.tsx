// src/pages/Packages.tsx
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PackageCard from "../components/packages/PackageCard";
import FilterPanel from "../components/packages/FilterPanel";
import { useWnppSearch, useWnppCount } from "../hooks/useWnppSearch";
import type { WnppSearchParams } from "../types/wnpp";
import StatSkeleton from "@/components/skeletons/StatSkeleton";
import { PaginationSkeleton } from "@/components/skeletons/PaginationSkeleton";
import { InlineCountSkeleton } from "@/components/skeletons/InlineCountSkeleton";

export default function Packages() {
  const [filters, setFilters] = useState<WnppSearchParams>({
    q: "",
    type: undefined,
    owner: "all",
  });

  const [sortBy, setSortBy] = useState("dust_days_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Map sort value to API parameters
  const [apiOrder, apiSortOrder] = useMemo(() => {
    const [field, order] = sortBy.split("_");
    // Map 'name' to appropriate field if needed, otherwise use dust_days, installs, arrival
    const orderField = field === "name" ? "dust_days" : field; // API doesn't support name sorting
    return [
      orderField as "lastModified" | "installs" | "arrival",
      order as "asc" | "desc",
    ];
  }, [sortBy]);

  // Build API params
  const apiParams = useMemo(() => {
    const params: WnppSearchParams = {
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      order: apiOrder,
    };

    if (filters.q) {
      params.q = filters.q;
    }

    if (filters.type) {
      params.type = filters.type;
    }

    if (filters.owner) {
      params.owner = filters.owner;
    }

    return params;
  }, [filters.q, filters.type, filters.owner, currentPage, apiOrder]);

  // Fetch packages
  const { data: packages = [], isLoading, error } = useWnppSearch(apiParams);

  // Fetch total count for the current filters
  const countParams = useMemo(() => {
    const params: WnppSearchParams = {};
    if (filters.type) {
      params.type = filters.type;
    }
    if (filters.owner) {
      params.owner = filters.owner;
    }

    return params;
  }, [filters.type, filters.owner]);

  const { data: totalCount, isLoading: isTotalCountLoading } =
    useWnppCount(countParams);

  const { data: withoutOwnerCount, isLoading: isWithoutOwnerLoading } =
    useWnppCount({ owner: "false" });

  // Apply client-side sorting for name (since API doesn't support it) and sort order
  const sortedPackages = useMemo(() => {
    const result = [...packages];

    // If sorting by name, do it client-side
    if (sortBy === "name_asc") {
      result.sort((a, b) => (a.source || "").localeCompare(b.source || ""));
    } else if (sortBy === "name_desc") {
      result.sort((a, b) => (b.source || "").localeCompare(a.source || ""));
    } else if (apiSortOrder === "asc") {
      // Reverse for ascending order (API returns descending by default)
      result.reverse();
    }

    return result;
  }, [packages, sortBy, apiSortOrder]);

  const handleResetFilters = () => {
    setFilters({ q: "", type: undefined, owner: "all" });
    setCurrentPage(1);
  };

  const handleFiltersChange = (filters: WnppSearchParams) => {
    setFilters(filters);
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  /*useEffect(() => {
    setCurrentPage(1);
  }, [filters.q, filters.type, filters.owner, sortBy]);*/

  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Debian Header */}
      <div className="bg-[#2B5672] text-white py-12 mb-8 shadow-md relative overflow-hidden">
        {/* Wave patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
              fill="rgba(255,255,255,0.1)"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0,70 Q30,55 60,70 T120,70 L120,100 L0,100 Z"
              fill="rgba(255,255,255,0.05)"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="/debian-logo.svg"
              alt="Debian Logo"
              className="w-24 h-24"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Debian Packages that Need Lovin'
              </h1>
              <p className="text-cyan-100 mt-2 text-lg">
                Help maintain the universal operating system
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg p-5 border-2 border-slate-200">
              <div className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                Total Packages
              </div>
              <div className="text-4xl font-bold text-[#2B5672]">
                {isTotalCountLoading ? <StatSkeleton /> : totalCount}
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-[#D70A53]">
              <div className="text-sm font-semibold text-[#D70A53] mb-2 uppercase tracking-wide">
                Without Owner
              </div>
              <div className="text-4xl font-bold text-[#D70A53]">
                {isWithoutOwnerLoading ? <StatSkeleton /> : withoutOwnerCount}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <FilterPanel
          filters={filters}
          setFilters={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Pagination Header */}
        {isTotalCountLoading || totalCount === undefined ? (
          <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
            <PaginationSkeleton />
          </div>
        ) : (
          totalCount > 0 && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-slate-500"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={
                        currentPage === page
                          ? "bg-[#D70A53] hover:bg-[#D70A53]/90"
                          : "border-slate-300"
                      }
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="border-slate-300"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>

                <span className="ml-4 text-sm text-slate-600">
                  {isTotalCountLoading ? (
                    <InlineCountSkeleton width="12ch" />
                  ) : (
                    <>
                      (1 to {Math.min(currentPage * itemsPerPage, totalCount)}:{" "}
                      <span className="font-semibold">{totalCount} total</span>)
                    </>
                  )}
                </span>
              </div>
            </div>
          )
        )}

        {/* Sort and Results Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {isLoading ? (
                <InlineCountSkeleton width="2ch" />
              ) : (
                sortedPackages.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {isTotalCountLoading ? <InlineCountSkeleton /> : totalCount}
            </span>{" "}
            package
            {!isTotalCountLoading && totalCount !== 1 ? "s" : ""}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dust_days_desc">Oldest First</SelectItem>
                <SelectItem value="dust_days_asc">Newest First</SelectItem>
                <SelectItem value="installs_desc">Most Installs</SelectItem>
                <SelectItem value="installs_asc">Least Installs</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Error loading packages
            </h3>
            <p className="text-slate-500">{(error as Error).message}</p>
          </motion.div>
        )}

        {/* Package List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#D70A53]" />
          </div>
        ) : sortedPackages.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No packages found
            </h3>
            <p className="text-slate-500">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <>
            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden mb-6">
              <div className="max-h-[600px] overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence mode="popLayout">
                    {sortedPackages.map((pkg) => (
                      <PackageCard key={pkg.bug_id} pkg={pkg} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Pagination Footer */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-slate-500"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={
                        currentPage === page
                          ? "bg-[#D70A53] hover:bg-[#D70A53]/90"
                          : "border-slate-300"
                      }
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="border-slate-300"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>

                <span className="ml-4 text-sm text-slate-600">
                  {totalCount == undefined || isTotalCountLoading ? (
                    <InlineCountSkeleton width="12ch" />
                  ) : (
                    <>
                      (1 to {Math.min(currentPage * itemsPerPage, totalCount)}:{" "}
                      <span className="font-semibold">{totalCount} total</span>)
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Author Credit */}
            <div className="mt-8 text-center text-sm text-slate-600 border-t border-slate-200 pt-6">
              Written by{" "}
              <a
                href="https://github.com/hartwork"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D70A53] hover:underline"
              >
                GB
              </a>
              , licensed under{" "}
              <a
                href="https://www.gnu.org/licenses/agpl-3.0.en.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D70A53] hover:underline"
              >
                AGPL 3.0 or later
              </a>
              . Want to contribute? Go to the repository on{" "}
              <a
                href="https://github.com/Debian-WNPP-Reloaded"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D70A53] hover:underline"
              >
                GitHub
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
