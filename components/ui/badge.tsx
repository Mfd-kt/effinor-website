import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-effinor-emerald text-white hover:bg-effinor-emerald-hover focus:ring-effinor-emerald",
        secondary:
          "border-transparent bg-effinor-gray-medium text-effinor-gray-dark hover:bg-effinor-gray-text/20 focus:ring-effinor-gray-text",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
        outline: "text-effinor-gray-dark border-effinor-blue-steel",
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

