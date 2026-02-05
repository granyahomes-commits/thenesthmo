 import { PostcodeMetrics } from "@/data/mockData";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
 
 interface PostcodeTableProps {
   data: PostcodeMetrics[];
   onViewDetails: (postcode: string) => void;
 }
 
 export function PostcodeTable({ data, onViewDetails }: PostcodeTableProps) {
   const getTrendIcon = (trend: "rising" | "stable" | "falling") => {
     switch (trend) {
       case "rising":
         return <TrendingUp className="text-success" size={16} />;
       case "falling":
         return <TrendingDown className="text-destructive" size={16} />;
       default:
         return <Minus className="text-muted-foreground" size={16} />;
     }
   };
 
   const getOpportunityBadge = (score: number) => {
     if (score >= 70) {
       return <Badge className="bg-success">High</Badge>;
     }
     if (score >= 40) {
       return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
     }
     return <Badge variant="secondary">Low</Badge>;
   };
 
   return (
     <div className="rounded-lg border border-border overflow-hidden">
       <Table>
         <TableHeader>
           <TableRow className="bg-secondary/50">
             <TableHead>Postcode</TableHead>
             <TableHead className="text-right">Active Rooms</TableHead>
             <TableHead className="text-right">Avg Rent</TableHead>
             <TableHead className="text-right">Enquiry Rate</TableHead>
             <TableHead className="text-right">Time to Let</TableHead>
             <TableHead className="text-center">Demand</TableHead>
             <TableHead className="text-center">Opportunity</TableHead>
             <TableHead></TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {data.map((row) => (
             <TableRow key={row.postcode} className="hover:bg-secondary/30">
               <TableCell>
                 <div>
                   <p className="font-semibold">{row.postcode}</p>
                   <p className="text-sm text-muted-foreground">{row.area}</p>
                 </div>
               </TableCell>
               <TableCell className="text-right font-medium">{row.activeRooms}</TableCell>
               <TableCell className="text-right font-medium">£{row.avgRent}</TableCell>
               <TableCell className="text-right">{row.enquiryRate}%</TableCell>
               <TableCell className="text-right">{row.avgTimeToLet} days</TableCell>
               <TableCell className="text-center">
                 <div className="flex items-center justify-center gap-1">
                   {getTrendIcon(row.demandTrend)}
                   <span className="text-sm capitalize">{row.demandTrend}</span>
                 </div>
               </TableCell>
               <TableCell className="text-center">
                 {getOpportunityBadge(row.opportunityScore)}
               </TableCell>
               <TableCell>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => onViewDetails(row.postcode)}
                 >
                   <ArrowRight size={16} />
                 </Button>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </div>
   );
 }