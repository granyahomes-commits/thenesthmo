 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { Navbar } from "@/components/layout/Navbar";
 import { Footer } from "@/components/layout/Footer";
 import { MetricCard } from "@/components/investors/MetricCard";
 import { ScoreGauge } from "@/components/investors/ScoreGauge";
 import { PostcodeTable } from "@/components/investors/PostcodeTable";
 import { AIInsightCard } from "@/components/investors/AIInsightCard";
 import { mockPostcodeMetrics } from "@/data/mockData";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 import { useToast } from "@/hooks/use-toast";
 import {
   Building2,
   PoundSterling,
   Users,
   Clock,
   Search,
   Lock,
   TrendingUp,
   BarChart3,
   Shield,
   CheckCircle2,
 } from "lucide-react";
 
 export default function Investors() {
   const { toast } = useToast();
   const [searchPostcode, setSearchPostcode] = useState("");
   const [selectedMetrics, setSelectedMetrics] = useState(mockPostcodeMetrics[0]);
 
   const handleSearch = () => {
     const found = mockPostcodeMetrics.find(
       (m) => m.postcode.toLowerCase() === searchPostcode.toLowerCase()
     );
     if (found) {
       setSelectedMetrics(found);
       toast({
         title: "Postcode Found",
         description: `Showing data for ${found.postcode} - ${found.area}`,
       });
     } else {
       toast({
         title: "Postcode Not Found",
         description: "Try searching for M14, LS6, B29, NG7, or BS6",
         variant: "destructive",
       });
     }
   };
 
   const handleViewDetails = (postcode: string) => {
     const found = mockPostcodeMetrics.find((m) => m.postcode === postcode);
     if (found) {
       setSelectedMetrics(found);
     }
   };
 
   return (
     <div className="min-h-screen flex flex-col bg-background">
       <Navbar />
 
       {/* Hero Section */}
       <section className="bg-primary text-primary-foreground py-12">
         <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
             <div className="max-w-2xl">
               <Badge className="bg-accent/20 text-accent mb-4">Market Intelligence</Badge>
               <h1 className="text-3xl md:text-4xl font-bold mb-4">
                 Postcode-Level HMO Analytics
               </h1>
               <p className="text-primary-foreground/80">
                 Make data-driven investment decisions with insights generated from real platform activity.
               </p>
             </div>
             <div className="flex gap-3">
               <Input
                 placeholder="Enter postcode (e.g. M14)"
                 value={searchPostcode}
                 onChange={(e) => setSearchPostcode(e.target.value)}
                 className="w-48 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                 onKeyDown={(e) => e.key === "Enter" && handleSearch()}
               />
               <Button 
                 onClick={handleSearch}
                 className="bg-accent hover:bg-accent/90 text-accent-foreground"
               >
                 <Search size={18} />
               </Button>
             </div>
           </div>
         </div>
       </section>
 
       {/* Main Dashboard */}
       <section className="flex-1 py-8">
         <div className="container mx-auto px-4">
           {/* Selected Postcode Header */}
           <div className="flex items-center gap-4 mb-6">
             <h2 className="text-2xl font-bold">{selectedMetrics.postcode}</h2>
             <span className="text-muted-foreground">{selectedMetrics.area}</span>
             <Badge 
               className={
                 selectedMetrics.demandTrend === "rising" 
                   ? "bg-success" 
                   : selectedMetrics.demandTrend === "falling"
                   ? "bg-destructive"
                   : "bg-secondary"
               }
             >
               <TrendingUp size={14} className="mr-1" />
               {selectedMetrics.demandTrend.charAt(0).toUpperCase() + selectedMetrics.demandTrend.slice(1)} Demand
             </Badge>
           </div>
 
           {/* Metric Cards */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <MetricCard
               title="Active Rooms"
               value={selectedMetrics.activeRooms}
               subtitle="on platform"
               icon={Building2}
             />
             <MetricCard
               title="Average Rent"
               value={`£${selectedMetrics.avgRent}`}
               subtitle="per month"
               icon={PoundSterling}
             />
             <MetricCard
               title="Enquiry Rate"
               value={`${selectedMetrics.enquiryRate}%`}
               subtitle="search → enquiry"
               icon={Users}
               trend={{ value: 2.3, label: "vs last month", direction: "up" }}
             />
             <MetricCard
               title="Time to Let"
               value={`${selectedMetrics.avgTimeToLet} days`}
               subtitle="average"
               icon={Clock}
               trend={{ value: 1.5, label: "vs last month", direction: "down" }}
             />
           </div>
 
           <div className="grid lg:grid-cols-3 gap-8">
             {/* Scores Panel */}
             <Card className="lg:col-span-1">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <BarChart3 className="text-accent" size={20} />
                   Opportunity Analysis
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <ScoreGauge
                   label="Saturation Score"
                   score={selectedMetrics.saturationScore}
                   description="How competitive is this market"
                 />
                 <ScoreGauge
                   label="Opportunity Score"
                   score={selectedMetrics.opportunityScore}
                   description="Relative investment potential"
                 />
                 <div className="pt-4 border-t border-border">
                   <p className="text-sm text-muted-foreground mb-3">
                     Searches this month
                   </p>
                   <p className="text-2xl font-bold">{selectedMetrics.searchVolume.toLocaleString()}</p>
                 </div>
               </CardContent>
             </Card>
 
             {/* Postcode Comparison Table */}
             <div className="lg:col-span-2">
                <AIInsightCard metrics={selectedMetrics} />
                <div className="mt-6">
               <Card>
                 <CardHeader>
                   <CardTitle>Compare Postcodes</CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                   <PostcodeTable
                     data={mockPostcodeMetrics}
                     onViewDetails={handleViewDetails}
                   />
                 </CardContent>
               </Card>
                </div>
             </div>
           </div>
 
           {/* Subscription CTA */}
           <Card className="mt-8 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
             <CardContent className="py-8">
               <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                 <div className="flex items-start gap-4">
                   <div className="p-3 bg-accent/20 rounded-lg">
                     <Lock className="text-accent" size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-2">Unlock Full Analytics</h3>
                     <p className="text-primary-foreground/80 max-w-xl">
                       Get access to all UK postcodes, historical trends, heatmaps, and downloadable reports 
                       with our Investor subscription.
                     </p>
                   </div>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-3">
                   <Button 
                     size="lg"
                     className="bg-accent hover:bg-accent/90 text-accent-foreground"
                     asChild
                   >
                     <Link to="/pricing">View Plans from £99/mo</Link>
                   </Button>
                 </div>
               </div>
             </CardContent>
           </Card>
 
           {/* Data Trust Notice */}
           <div className="mt-8 flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
             <Shield className="text-success flex-shrink-0 mt-0.5" size={20} />
             <div className="text-sm text-muted-foreground">
               <p className="font-medium text-foreground mb-1">First-Party Data Only</p>
               <p>
                 All insights are generated from real platform activity. We do not scrape or copy data from 
                 third-party platforms. Analytics are for decision support only and do not constitute financial advice.
               </p>
             </div>
           </div>
         </div>
       </section>
 
       <Footer />
     </div>
   );
 }