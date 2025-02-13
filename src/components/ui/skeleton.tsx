import { cn } from "@/lib/utils"

const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`} />
  );
};

export default Skeleton;
