import * as React from "react";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
  spacing?: "none" | "default" | "tight";
};

export function Section({ as = "section", spacing = "default", className, ...props }: SectionProps) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        spacing === "none" ? "" : spacing === "tight" ? "py-10 md:py-12" : "py-16 md:py-20",
        className,
      )}
      {...props}
    />
  );
}

