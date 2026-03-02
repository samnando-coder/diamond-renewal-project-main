export function ShopProductCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden h-full flex flex-col animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-5 flex flex-col gap-3 grow">
        <div className="h-3 w-24 bg-muted rounded" />
        <div className="h-5 w-4/5 bg-muted rounded" />
        <div className="h-5 w-3/5 bg-muted rounded" />
        <div className="mt-auto">
          <div className="h-4 w-28 bg-muted rounded mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-muted rounded-sm" />
            <div className="h-10 bg-muted rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

