import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-effinor-emerald text-white hover:bg-effinor-emerald-hover focus-visible:ring-effinor-emerald",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline:
          "border-2 border-effinor-blue-steel bg-transparent text-effinor-gray-dark hover:bg-effinor-gray-medium focus-visible:ring-effinor-blue-steel",
        secondary:
          "bg-white border-2 border-effinor-emerald text-effinor-emerald hover:bg-effinor-emerald/10 focus-visible:ring-effinor-emerald",
        ghost: "hover:bg-effinor-gray-medium hover:text-effinor-gray-dark focus-visible:ring-effinor-blue-steel",
        link: "text-effinor-emerald underline-offset-4 hover:underline focus-visible:ring-effinor-emerald",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(buttonVariants({ variant, size }), className, children.props.className),
        ref,
        ...children.props,
        ...props,
      });
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

