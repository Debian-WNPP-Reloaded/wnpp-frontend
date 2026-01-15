import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users, Calendar, Download, Package, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { WnppPackage } from "@/types/wnpp";
import { formatDistanceToNow } from "date-fns";

const typeColors = {
  RFH: "bg-red-50 text-[#D70A53] border-[#D70A53]",
  ITA: "bg-cyan-50 text-cyan-700 border-cyan-300",
  RFA: "bg-blue-50 text-blue-700 border-blue-300",
  O: "bg-slate-100 text-slate-700 border-slate-300",
  RFP: "bg-teal-50 text-teal-700 border-teal-300",
  ITP: "bg-purple-50 text-purple-700 border-purple-300",
};

const typeLabels = {
  O: "Orphaned",
  RFA: "Request for Adoption",
  RFH: "Request for Help",
  RFP: "Request for Package",
  ITA: "Intent to Adopt",
  ITP: "Intent to Package",
};

const priorityColors = {
  high: "border-l-[#D70A53]",
  medium: "border-l-[#2B5672]",
  low: "border-l-slate-300",
};

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface PackageCardProps {
  pkg: WnppPackage;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const hasOwner = pkg.owner && pkg.owner !== "nobody";

  // Determine priority based on installs or type
  const getPriority = () => {
    if (pkg.type === "O") return "high"; // Orphaned packages are high priority
    if (pkg.installs && pkg.installs > 10000) return "medium";
    return "low";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`p-6 hover:shadow-md transition-all duration-200 border-l-4 ${
          priorityColors[getPriority()]
        } bg-white border border-slate-200`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-[#2B5672] flex-shrink-0" />
              <h3 className="text-lg font-bold text-[#2B5672] truncate">
                {pkg.source}
              </h3>
              <Badge
                variant="outline"
                className={`${typeColors[pkg.type]} font-medium flex-shrink-0`}
                title={typeLabels[pkg.type]}
              >
                {pkg.type}
              </Badge>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
              {pkg.title}
            </p>

            <TooltipProvider>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                {pkg.arrival !== null && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDistanceToNow(new Date(pkg.arrival), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Arrived on {formatDate(pkg.arrival)}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <Download className="w-4 h-4" />
                      <span>{pkg.installs?.toLocaleString() || "N/A"}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Installs</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span
                        className={
                          hasOwner ? "text-emerald-600" : "text-slate-400"
                        }
                      >
                        {pkg.owner_name || pkg.owner || "nobody"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Owner</p>
                  </TooltipContent>
                </Tooltip>

                {pkg.last_modified && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatDistanceToNow(new Date(pkg.last_modified), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last modified on {formatDate(pkg.last_modified)}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {pkg.bug_id && (
                  <a
                    href={`https://bugs.debian.org/${pkg.bug_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D70A53] hover:text-[#D70A53]/80 hover:underline transition-colors"
                  >
                    #{pkg.bug_id}
                  </a>
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
