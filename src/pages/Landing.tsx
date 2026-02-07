 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Navbar } from "@/components/layout/Navbar";
 import { Footer } from "@/components/layout/Footer";
 import { 
   Search, 
   Building2, 
   TrendingUp, 
   Users, 
   Shield, 
   BarChart3,
   ArrowRight,
   CheckCircle2,
   MapPin
 } from "lucide-react";
 
 const features = [
   {
     icon: Search,
     title: "For Tenants",
     description: "Search HMO rooms across the UK with real-time availability and transparent pricing.",
     link: "/rooms",
     cta: "Find a Room",
   },
   {
     icon: Building2,
     title: "For Landlords",
     description: "List your rooms, reduce voids, and track performance with actionable insights.",
     link: "/landlords",
     cta: "List Property",
   },
   {
     icon: TrendingUp,
     title: "For Investors",
     description: "Access postcode-level HMO market intelligence powered by first-party data.",
     link: "/investors",
     cta: "View Analytics",
   },
 ];
 
 const stats = [
   { value: "2,400+", label: "Active Rooms" },
   { value: "156", label: "UK Postcodes" },
   { value: "89%", label: "Enquiry Rate" },
   { value: "12 days", label: "Avg. Time to Let" },
 ];
 
 const benefits = [
   "First-party data only – no third-party scraping",
   "GDPR compliant data handling",
   "Real-time market signals from platform activity",
   "Transparent, rules-based analytics",
 ];
 
 export default function Landing() {
   return (
     <div className="min-h-screen flex flex-col">
       <Navbar />
 
       {/* Hero Section */}
       <section className="relative gradient-hero text-primary-foreground py-20 lg:py-32 overflow-hidden">
         <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-cover bg-center" />
         <div className="container mx-auto px-4 relative">
           <div className="max-w-3xl mx-auto text-center animate-fade-up">
             <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
               <MapPin size={16} />
               <span className="text-sm font-medium">UK HMO Market Intelligence</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
               The Smart Way to Navigate the{" "}
               <span className="text-accent">HMO Market</span>
             </h1>
             <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
               Connect tenants, landlords, and investors through the UK's first 
               postcode-level HMO intelligence platform – powered by real platform data.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button 
                 size="lg" 
                 className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent"
                 asChild
               >
                 <Link to="/rooms">
                   Find a Room <ArrowRight className="ml-2" size={18} />
                 </Link>
               </Button>
               <Button 
                 size="lg" 
                 variant="outline" 
                 className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                 asChild
               >
                 <Link to="/investors">View Market Data</Link>
               </Button>
             </div>
           </div>
         </div>
       </section>
 
       {/* Stats Section */}
       <section className="py-12 bg-card border-b border-border">
         <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {stats.map((stat, index) => (
               <div 
                 key={stat.label} 
                 className="text-center animate-fade-up"
                 style={{ animationDelay: `${index * 100}ms` }}
               >
                 <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                 <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Features Section */}
       <section className="py-20 bg-background">
         <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">One Platform, Three Perspectives</h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               Whether you're searching for a room, listing a property, or analysing HMO investment opportunities – The Nest provides the intelligence you need.
             </p>
           </div>
 
           <div className="grid md:grid-cols-3 gap-6">
             {features.map((feature, index) => (
               <Card 
                 key={feature.title}
                 className="group hover:shadow-soft transition-all duration-300 border-border hover:border-accent/30 animate-fade-up"
                 style={{ animationDelay: `${index * 150}ms` }}
               >
                 <CardContent className="p-6">
                   <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                     <feature.icon className="text-accent" size={24} />
                   </div>
                   <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                   <p className="text-muted-foreground mb-4">{feature.description}</p>
                   <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80" asChild>
                     <Link to={feature.link}>
                       {feature.cta} <ArrowRight className="ml-1" size={16} />
                     </Link>
                   </Button>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
       </section>
 
       {/* Data Trust Section */}
       <section className="py-20 bg-secondary/30">
         <div className="container mx-auto px-4">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <div className="inline-flex items-center gap-2 bg-success/10 text-success rounded-full px-3 py-1 mb-4">
                 <Shield size={16} />
                 <span className="text-sm font-medium">Compliant & Transparent</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-bold mb-6">
                 Market Intelligence You Can Trust
               </h2>
               <p className="text-muted-foreground mb-6">
                 Unlike other platforms, The Nest generates insights exclusively from first-party platform data. 
                 No scraping, no database copying – just genuine market signals from real user activity.
               </p>
               <ul className="space-y-3">
                 {benefits.map((benefit) => (
                   <li key={benefit} className="flex items-center gap-3">
                     <CheckCircle2 className="text-success flex-shrink-0" size={20} />
                     <span>{benefit}</span>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
               <div className="flex items-center gap-3 mb-6">
                 <BarChart3 className="text-accent" size={24} />
                 <h3 className="font-semibold">Sample Postcode Insight</h3>
               </div>
               <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-border">
                   <span className="text-muted-foreground">Postcode</span>
                   <span className="font-semibold">M14 (Fallowfield)</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-border">
                   <span className="text-muted-foreground">Active Rooms</span>
                   <span className="font-semibold">47</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-border">
                   <span className="text-muted-foreground">Avg. Rent (pcm)</span>
                   <span className="font-semibold">£545</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-border">
                   <span className="text-muted-foreground">Opportunity Score</span>
                   <div className="flex items-center gap-2">
                     <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                       <div className="h-full bg-accent rounded-full" style={{ width: "68%" }} />
                     </div>
                     <span className="font-semibold">68</span>
                   </div>
                 </div>
                 <div className="flex justify-between items-center py-3">
                   <span className="text-muted-foreground">Demand Trend</span>
                   <span className="inline-flex items-center gap-1 text-success font-semibold">
                     <TrendingUp size={16} /> Rising
                   </span>
                 </div>
               </div>
               <Button className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                 <Link to="/investors">Unlock Full Analytics</Link>
               </Button>
             </div>
           </div>
         </div>
       </section>
 
       {/* CTA Section */}
       <section className="py-20 bg-primary text-primary-foreground">
         <div className="container mx-auto px-4 text-center">
           <div className="flex justify-center mb-6">
             <Users className="text-accent" size={48} />
           </div>
           <h2 className="text-3xl md:text-4xl font-bold mb-4">
             Join the UK's Smartest HMO Platform
           </h2>
           <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
             Whether you're a tenant searching for your next home, a landlord looking to optimise your portfolio, 
             or an investor seeking opportunities – get started today.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button 
               size="lg" 
               className="bg-accent hover:bg-accent/90 text-accent-foreground"
               asChild
             >
               <Link to="/register">Create Free Account</Link>
             </Button>
             <Button 
               size="lg" 
               variant="outline" 
               className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
               asChild
             >
               <Link to="/pricing">View Pricing</Link>
             </Button>
           </div>
         </div>
       </section>
 
       <Footer />
     </div>
   );
 }