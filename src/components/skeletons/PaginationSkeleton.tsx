export function PaginationSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="h-8 w-20 rounded bg-slate-200 animate-pulse" />
      <div className="h-8 w-8 rounded bg-slate-200 animate-pulse" />
      <div className="h-8 w-8 rounded bg-slate-200 animate-pulse" />
      <div className="h-8 w-8 rounded bg-slate-200 animate-pulse" />
      <div className="h-8 w-20 rounded bg-slate-200 animate-pulse" />
    </div>
  );
}
