import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, style, ...props }, ref) => {
    // Calculer le padding en pixels pour le style inline (garantie absolue, écrase tout)
    const paddingPx = padding === "3xl" ? "64px" : 
                      padding === "2xl" ? "48px" : 
                      padding === "xl" ? "40px" : 
                      padding === "lg" ? "32px" : 
                      padding === "md" ? "24px" : 
                      padding === "sm" ? "16px" : 
                      padding === "none" ? "0" : 
                      padding === undefined ? "32px" : "32px"; // Default to lg (32px)

    // Fusionner les styles : le style inline du padding écrase tout
    const mergedStyle: React.CSSProperties = {
      ...style,
      ...(padding !== undefined ? { padding: paddingPx } : {}),
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-gray-100 bg-white text-[#111827] shadow-[0_10px_40px_rgba(15,23,42,0.1)]",
          className
        )}
        style={mergedStyle}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#4B5563]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

