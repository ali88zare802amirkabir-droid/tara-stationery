import { Skeleton } from '@/components/ui/Feedback';

export default function AdminLoading() {
  return (
    <div className="space-y-5" role="status" aria-label="در حال بارگذاری پنل مدیریت">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-3xl" />
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
