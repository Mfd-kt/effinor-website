import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatBadgeProps {
  label: string;
  color?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export function StatBadge({
  label,
  color,
  variant = "default",
  className,
}: StatBadgeProps) {
  if (color) {
    return (
      <Badge
        variant="outline"
        className={cn("border-2", className)}
        style={{ borderColor: color, color }}
      >
        {label}
      </Badge>
    );
  }

  return <Badge variant={variant} className={className}>{label}</Badge>;
}

