import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(
  undefined
);

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <SheetContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      <div className="fixed inset-0 z-50">
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => handleOpenChange(false)}
        />
        <div className="relative z-50">{children}</div>
      </div>
    </SheetContext.Provider>
  );
};

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used within Sheet");

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: () => context.onOpenChange(true),
    } as any);
  }

  return (
    <Button ref={ref} onClick={() => context.onOpenChange(true)} {...props}>
      {children}
    </Button>
  );
});
SheetTrigger.displayName = "SheetTrigger";

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: "left" | "right" }
>(({ className, side = "right", children, ...props }, ref) => {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("SheetContent must be used within Sheet");

  return (
    <div
      ref={ref}
      className={cn(
        "fixed z-50 h-full w-full border border-gray-100 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.1)] transition-transform sm:max-w-sm",
        side === "right" ? "right-0 top-0" : "left-0 top-0",
        className
      )}
      {...props}
    >
      {children}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 lg:hidden"
        onClick={() => context.onOpenChange(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#4B5563]", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};

