import { LucideIcon } from "lucide-react";
import { AdminCard } from "./AdminCard";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  loading?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  loading = false 
}: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive": return "text-emerald-600 bg-emerald-50";
      case "negative": return "text-red-600 bg-red-50";
      default: return "text-muted-foreground bg-secondary";
    }
  };

  if (loading) {
    return (
      <AdminCard>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-secondary animate-pulse rounded"></div>
            <div className="h-8 w-24 bg-secondary animate-pulse rounded"></div>
            <div className="h-3 w-16 bg-secondary animate-pulse rounded"></div>
          </div>
          <div className="h-12 w-12 bg-secondary animate-pulse rounded-full"></div>
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard className="hover:scale-[1.02] transition-transform">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <Badge variant="secondary" className={cn("text-xs", getChangeColor())}>
              {change}
            </Badge>
          )}
        </div>
        <div className={cn(
          "h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center",
          iconColor
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </AdminCard>
  );
}