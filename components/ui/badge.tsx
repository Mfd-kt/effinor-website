import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#10B981] text-white hover:bg-[#059669] focus:ring-[#10B981]",
        secondary:
          "border-transparent bg-[#F3F4F6] text-[#111827] hover:bg-[#4B5563]/20 focus:ring-[#4B5563]",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
        outline: "text-[#111827] border-[#334155]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

