import { motion } from "framer-motion";

export default function StatSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      className="h-9 w-24 rounded bg-slate-200"
    />
  );
}
