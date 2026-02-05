 interface ScoreGaugeProps {
   label: string;
   score: number;
   description?: string;
 }
 
 export function ScoreGauge({ label, score, description }: ScoreGaugeProps) {
   const getScoreColor = (score: number) => {
     if (score >= 70) return "bg-success";
     if (score >= 40) return "bg-warning";
     return "bg-destructive";
   };
 
   const getScoreLabel = (score: number) => {
     if (score >= 70) return "High";
     if (score >= 40) return "Medium";
     return "Low";
   };
 
   return (
     <div className="space-y-2">
       <div className="flex items-center justify-between">
         <span className="text-sm font-medium">{label}</span>
         <div className="flex items-center gap-2">
           <span className="text-sm text-muted-foreground">{getScoreLabel(score)}</span>
           <span className="font-bold">{score}</span>
         </div>
       </div>
       <div className="h-3 bg-secondary rounded-full overflow-hidden">
         <div
           className={`h-full rounded-full transition-all duration-500 ${getScoreColor(score)}`}
           style={{ width: `${score}%` }}
         />
       </div>
       {description && (
         <p className="text-xs text-muted-foreground">{description}</p>
       )}
     </div>
   );
 }