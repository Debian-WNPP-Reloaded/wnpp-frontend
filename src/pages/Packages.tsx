import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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

export default function Packages() {
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    ownerStatus: "all",
  });

  const [sortBy, setSortBy] = useState("dust_days_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const { data: packages = [], isLoading = false } = {
    data: [],
    isLoading: false,
  }; /*= useQuery({
    queryKey: ["packages"],
    queryFn: () => [], //base44.entities.Package.list(),
  });*/

  const filteredAndSortedPackages = useMemo(() => {
    let result = [...packages];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (pkg) =>
          pkg.project_name?.toLowerCase().includes(searchLower) ||
          pkg.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type !== "all") {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      if (types.length > 0) {
        result = result.filter((pkg) => types.includes(pkg.type));
      }
    }

    if (filters.ownerStatus === "with") {
      result = result.filter((pkg) => pkg.owner && pkg.owner !== "nobody");
    } else if (filters.ownerStatus === "without") {
      result = result.filter((pkg) => !pkg.owner || pkg.owner === "nobody");
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "dust_days_desc":
          return (b.dust_days || 0) - (a.dust_days || 0);
        case "dust_days_asc":
          return (a.dust_days || 0) - (b.dust_days || 0);
        case "installs_desc":
          return (b.installs || 0) - (a.installs || 0);
        case "installs_asc":
          return (a.installs || 0) - (b.installs || 0);
        case "name_asc":
          return (a.project_name || "").localeCompare(b.project_name || "");
        case "name_desc":
          return (b.project_name || "").localeCompare(a.project_name || "");
        default:
          return 0;
      }
    });

    return result;
  }, [packages, filters, sortBy]);

  const handleResetFilters = () => {
    setFilters({ search: "", type: "all", ownerStatus: "all" });
    setCurrentPage(1);
  };

  const stats = useMemo(() => {
    const total = packages.length;
    const withoutOwner = packages.filter(
      (p) => !p.owner || p.owner === "nobody"
    ).length;
    return { total, withoutOwner };
  }, [packages]);

  const paginatedPackages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedPackages.slice(startIndex, endIndex);
  }, [filteredAndSortedPackages, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPackages.length / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
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
      <div className="bg-[#2B5672] text-white py-12 mb-8 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6960528a8d3c9404917bd164/72a56a8df_Untitled-removebg-preview.png"
              alt="Debian Logo"
              className="w-16 h-16"
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
                {stats.total}
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-[#D70A53]">
              <div className="text-sm font-semibold text-[#D70A53] mb-2 uppercase tracking-wide">
                Without Owner
              </div>
              <div className="text-4xl font-bold text-[#D70A53]">
                {stats.withoutOwner}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
        />

        {/* Pagination Header */}
        {filteredAndSortedPackages.length > 0 && (
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
                  <span key={`ellipsis-${idx}`} className="px-2 text-slate-500">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
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
                (1 to{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedPackages.length
                )}
                :{" "}
                <span className="font-semibold">
                  {filteredAndSortedPackages.length} total
                </span>
                )
              </span>
            </div>
          </div>
        )}

        {/* Sort and Results Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {paginatedPackages.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {filteredAndSortedPackages.length}
            </span>{" "}
            package{filteredAndSortedPackages.length !== 1 ? "s" : ""}
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

        {/* Package List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#D70A53]" />
          </div>
        ) : filteredAndSortedPackages.length === 0 ? (
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
                    {paginatedPackages.map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
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
                      onClick={() => setCurrentPage(page)}
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
                  (1 to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedPackages.length
                  )}
                  :{" "}
                  <span className="font-semibold">
                    {filteredAndSortedPackages.length} total
                  </span>
                  )
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
                Sebastian Pipping
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
              . Please star{" "}
              <a
                href="https://github.com/hartwork/debian-love"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D70A53] hover:underline"
              >
                the repository
              </a>{" "}
              on GitHub if you like this tool. Thanks!
            </div>
          </>
        )}
      </div>
    </div>
  );
}
