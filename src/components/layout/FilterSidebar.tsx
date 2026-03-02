import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type FilterSidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const FilterSidebarContext = React.createContext<FilterSidebarContextValue | null>(null);

function useFilterSidebarContext() {
  const ctx = React.useContext(FilterSidebarContext);
  if (!ctx) throw new Error("FilterSidebarTrigger must be used within <FilterSidebar />");
  return ctx;
}

type FilterSidebarProps = {
  filters: React.ReactNode;
  children: React.ReactNode;
  stickyTopClassName?: string; // e.g. "top-28"
  sidebarClassName?: string; // e.g. "lg:col-span-3"
  contentClassName?: string; // e.g. "lg:col-span-9"
  className?: string;
  mobileTitle?: string;
};

export function FilterSidebar({
  filters,
  children,
  stickyTopClassName = "top-28",
  sidebarClassName = "lg:col-span-3",
  contentClassName = "lg:col-span-9",
  className,
  mobileTitle = "Filters",
}: FilterSidebarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  return (
    <FilterSidebarContext.Provider value={{ open, setOpen }}>
      <div className={cn("grid gap-8 lg:grid-cols-12", className)}>
        <aside className={cn("hidden lg:block", sidebarClassName)}>
          <div className={cn("sticky", stickyTopClassName)}>
            <div className="bg-card border border-border rounded-sm p-6">{filters}</div>
          </div>
        </aside>
        <div className={cn(contentClassName)}>
          {children}
        </div>
      </div>

      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle>{mobileTitle}</SheetTitle>
            </SheetHeader>
            <div className="p-6">{filters}</div>
          </SheetContent>
        </Sheet>
      ) : null}
    </FilterSidebarContext.Provider>
  );
}

type FilterSidebarTriggerProps = React.ComponentProps<typeof Button> & {
  label?: string;
};

export function FilterSidebarTrigger({ label = "Filters", className, ...props }: FilterSidebarTriggerProps) {
  const { setOpen } = useFilterSidebarContext();
  return (
    <Button
      type="button"
      variant="outline"
      className={cn("gap-2", className)}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(true);
      }}
      {...props}
    >
      <SlidersHorizontal className="w-4 h-4" />
      {label}
    </Button>
  );
}

