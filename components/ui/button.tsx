import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#10B981] text-white hover:bg-[#10B981]-hover focus-visible:ring-[#10B981]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline:
          "border-2 border-[#334155] bg-transparent text-[#111827] hover:bg-[#F3F4F6] focus-visible:ring-effinor-blue-steel",
        secondary:
          "bg-white border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 focus-visible:ring-[#10B981]",
        ghost: "hover:bg-[#F3F4F6] hover:text-[#111827] focus-visible:ring-effinor-blue-steel",
        link: "text-[#10B981] underline-offset-4 hover:underline focus-visible:ring-[#10B981]",
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

