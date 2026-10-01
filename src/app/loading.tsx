import { Skeleton } from '@/components/ui/Feedback';

/** Route-level loading state for storefront navigation transitions. */
export default function Loading() {
  return (
    <div className="shell py-10 sm:py-14" role="status" aria-label="در حال بارگذاری">
      <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
        <div className="hidden lg:block">
          <Skeleton className="h-[32rem] w-full rounded-3xl" />
        </div>
        <div>
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-3 h-4 w-40" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="rounded-3xl border border-line bg-surface p-3">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="mt-4 h-3 w-1/2" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-4 h-10 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">در حال بارگذاری محتوا…</span>
    </div>
  );
}
