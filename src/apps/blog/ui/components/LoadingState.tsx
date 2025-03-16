
import { Skeleton } from "@/shared/components/ui/skeleton";

export const LoadingState = () => {
  return (
    <div className="container mx-auto px-6 py-12 flex justify-center">
      <div className="animate-pulse w-full max-w-3xl">
        <Skeleton className="h-6 w-3/4 mb-8" />
        <div className="mb-8">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
};
