import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';

export function ResumeDetailsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="container flex-1 px-4 py-6">
        <Skeleton className="mb-4 h-24 w-full" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Skeleton className="h-[760px]" />
          <Skeleton className="h-[520px]" />
        </div>
      </main>
    </div>
  );
}
