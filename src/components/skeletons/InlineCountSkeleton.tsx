export function InlineCountSkeleton({ width = "4ch" }: { width?: string }) {
  return (
    <span
      className="inline-block h-4 align-middle rounded bg-slate-200 animate-pulse"
      style={{ width }}
    />
  );
}
