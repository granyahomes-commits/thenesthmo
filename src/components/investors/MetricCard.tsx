 import { Card, CardContent } from "@/components/ui/card";
 import { LucideIcon } from "lucide-react";
 
 interface MetricCardProps {
   title: string;
   value: string | number;
   subtitle?: string;
   icon: LucideIcon;
   trend?: {
     value: number;
     label: string;
     direction: "up" | "down" | "neutral";
   };
 }
 
 export function MetricCard({ title, value, subtitle, icon: Icon, trend }: MetricCardProps) {
   const trendColors = {
     up: "text-success",
     down: "text-destructive",
     neutral: "text-muted-foreground",
   };
 
   return (
     <Card className="hover:shadow-soft transition-shadow">
       <CardContent className="p-6">
         <div className="flex items-start justify-between mb-4">
           <div className="p-2 rounded-lg bg-accent/10">
             <Icon className="text-accent" size={20} />
           </div>
           {trend && (
             <span className={`text-sm font-medium ${trendColors[trend.direction]}`}>
               {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"} {trend.value}%
             </span>
           )}
         </div>
         <p className="text-sm text-muted-foreground mb-1">{title}</p>
         <p className="text-2xl font-bold">{value}</p>
         {subtitle && (
           <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
         )}
       </CardContent>
     </Card>
   );
 }