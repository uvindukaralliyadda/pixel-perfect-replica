import { TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string;
  trend: string;
  icon: LucideIcon;
  inverted?: boolean;
}

export function StatCard({ label, value, trend, icon: Icon, inverted }: Props) {
  return (
    <div
      className={cn(
        "group lift rounded-2xl border p-6",
        inverted
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground",
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-xl transition-colors duration-150",
            inverted
              ? "bg-primary-foreground text-primary"
              : "bg-muted group-hover:bg-primary-foreground group-hover:text-primary",
          )}
        >
          <Icon className="size-6" strokeWidth={1.5} />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold",
            inverted ? "opacity-80" : "text-muted-foreground group-hover:text-primary-foreground/80",
          )}
        >
          <TrendingUp className="size-3.5" strokeWidth={2} />
          {trend}
        </span>
      </div>
      <p className="stat-number mt-6">{value}</p>
      <p
        className={cn(
          "mt-2 text-sm font-medium",
          inverted ? "opacity-80" : "text-muted-foreground group-hover:text-primary-foreground/80",
        )}
      >
        {label}
      </p>
    </div>
  );
}
