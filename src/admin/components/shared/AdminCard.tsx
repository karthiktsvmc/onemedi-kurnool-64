import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

interface AdminCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  gradient?: boolean;
}

export function AdminCard({ 
  title, 
  description, 
  children, 
  className,
  headerAction,
  gradient = false 
}: AdminCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg border-border/50",
      gradient && "bg-gradient-to-br from-background to-secondary/20",
      className
    )}>
      {(title || description || headerAction) && (
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              {title && <CardTitle className="text-foreground">{title}</CardTitle>}
              {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={title || description ? "pt-0" : undefined}>
        {children}
      </CardContent>
    </Card>
  );
}