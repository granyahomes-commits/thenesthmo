 import { useState, useEffect } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Skeleton } from "@/components/ui/skeleton";
 import { useToast } from "@/hooks/use-toast";
 import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
 import { supabase } from "@/integrations/supabase/client";
 import type { PostcodeMetrics } from "@/data/mockData";
 
 interface AIInsightCardProps {
   metrics: PostcodeMetrics;
 }
 
 export function AIInsightCard({ metrics }: AIInsightCardProps) {
   const { toast } = useToast();
   const [insight, setInsight] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const fetchInsight = async () => {
     setIsLoading(true);
     setError(null);
 
     try {
       const { data, error: fnError } = await supabase.functions.invoke('postcode-insights', {
         body: { metrics }
       });
 
       if (fnError) {
         throw new Error(fnError.message);
       }
 
       if (data?.error) {
         if (data.error.includes('Rate limit')) {
           toast({
             title: "Rate Limited",
             description: "Too many requests. Please wait a moment.",
             variant: "destructive",
           });
         } else if (data.error.includes('credits')) {
           toast({
             title: "Credits Exhausted",
             description: "AI credits need to be topped up.",
             variant: "destructive",
           });
         }
         throw new Error(data.error);
       }
 
       setInsight(data.insight);
     } catch (err) {
       console.error('Failed to fetch insight:', err);
       setError(err instanceof Error ? err.message : 'Failed to generate insight');
     } finally {
       setIsLoading(false);
     }
   };
 
   // Fetch insight when metrics change
   useEffect(() => {
     fetchInsight();
   }, [metrics.postcode]);
 
   return (
     <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
       <CardHeader className="pb-3">
         <CardTitle className="flex items-center justify-between text-lg">
           <span className="flex items-center gap-2">
             <Sparkles className="text-accent" size={20} />
             AI Market Insight
           </span>
           <Button
             variant="ghost"
             size="sm"
             onClick={fetchInsight}
             disabled={isLoading}
             className="h-8 w-8 p-0"
           >
             <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
           </Button>
         </CardTitle>
       </CardHeader>
       <CardContent>
         {isLoading ? (
           <div className="space-y-2">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-[90%]" />
             <Skeleton className="h-4 w-[75%]" />
           </div>
         ) : error ? (
           <div className="flex items-start gap-3 text-muted-foreground">
             <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={18} />
             <div>
               <p className="text-sm">{error}</p>
               <Button
                 variant="link"
                 size="sm"
                 onClick={fetchInsight}
                 className="p-0 h-auto text-accent"
               >
                 Try again
               </Button>
             </div>
           </div>
         ) : (
           <p className="text-sm text-muted-foreground leading-relaxed">
             {insight}
           </p>
         )}
       </CardContent>
     </Card>
   );
 }