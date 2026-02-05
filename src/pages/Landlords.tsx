 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { Navbar } from "@/components/layout/Navbar";
 import { Footer } from "@/components/layout/Footer";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { Badge } from "@/components/ui/badge";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { useToast } from "@/hooks/use-toast";
 import { 
   Building2, 
   Plus, 
   Eye, 
   MessageSquare, 
   Clock,
   TrendingUp,
   CheckCircle2,
   ArrowRight
 } from "lucide-react";
 
 const benefits = [
   {
     icon: Eye,
     title: "Maximum Visibility",
     description: "Your listings reach verified tenants actively searching for HMO rooms.",
   },
   {
     icon: MessageSquare,
     title: "Direct Enquiries",
     description: "Receive enquiries directly. No middlemen, no delays.",
   },
   {
     icon: Clock,
     title: "Reduce Void Periods",
     description: "Track performance and optimise listings to let faster.",
   },
   {
     icon: TrendingUp,
     title: "Market Insights",
     description: "Understand how your rent compares to the local market.",
   },
 ];
 
 export default function Landlords() {
   const { toast } = useToast();
   const [formData, setFormData] = useState({
     postcode: "",
     rent: "",
     roomType: "",
     billsIncluded: false,
     ensuite: false,
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     toast({
       title: "Listing Preview Created",
       description: "Sign up to publish your listing and start receiving enquiries.",
     });
   };
 
   return (
     <div className="min-h-screen flex flex-col bg-background">
       <Navbar />
 
       {/* Hero Section */}
       <section className="bg-primary text-primary-foreground py-16 lg:py-24">
         <div className="container mx-auto px-4">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <Badge className="bg-accent/20 text-accent mb-4">For HMO Landlords</Badge>
               <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                 List Your Rooms, Reduce Voids
               </h1>
               <p className="text-lg text-primary-foreground/80 mb-8">
                 Join the UK's smartest HMO platform. Get your rooms in front of verified tenants, 
                 track performance, and let faster.
               </p>
               <div className="flex flex-wrap gap-4">
                 <div className="flex items-center gap-2 text-sm">
                   <CheckCircle2 className="text-success" size={18} />
                   <span>Free to list</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm">
                   <CheckCircle2 className="text-success" size={18} />
                   <span>Direct enquiries</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm">
                   <CheckCircle2 className="text-success" size={18} />
                   <span>Performance tracking</span>
                 </div>
               </div>
             </div>
 
             {/* Quick Listing Form */}
             <Card className="bg-card text-card-foreground shadow-soft">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Plus className="text-accent" size={20} />
                   Create a Listing
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <form onSubmit={handleSubmit} className="space-y-4">
                   <div>
                     <Label htmlFor="postcode">Postcode</Label>
                     <Input
                       id="postcode"
                       placeholder="e.g. M14 5RX"
                       value={formData.postcode}
                       onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                       className="mt-1"
                     />
                   </div>
 
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="rent">Monthly Rent (£)</Label>
                       <Input
                         id="rent"
                         type="number"
                         placeholder="550"
                         value={formData.rent}
                         onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                         className="mt-1"
                       />
                     </div>
                     <div>
                       <Label htmlFor="roomType">Room Type</Label>
                       <Select
                         value={formData.roomType}
                         onValueChange={(value) => setFormData({ ...formData, roomType: value })}
                       >
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="single">Single</SelectItem>
                           <SelectItem value="double">Double</SelectItem>
                           <SelectItem value="large-double">Large Double</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
 
                   <div className="flex items-center justify-between py-2">
                     <Label htmlFor="bills" className="cursor-pointer">Bills Included</Label>
                     <Switch
                       id="bills"
                       checked={formData.billsIncluded}
                       onCheckedChange={(checked) => 
                         setFormData({ ...formData, billsIncluded: checked })
                       }
                     />
                   </div>
 
                   <div className="flex items-center justify-between py-2">
                     <Label htmlFor="ensuite" className="cursor-pointer">Ensuite Bathroom</Label>
                     <Switch
                       id="ensuite"
                       checked={formData.ensuite}
                       onCheckedChange={(checked) => 
                         setFormData({ ...formData, ensuite: checked })
                       }
                     />
                   </div>
 
                   <Button 
                     type="submit" 
                     className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                   >
                     Preview Listing <ArrowRight className="ml-2" size={18} />
                   </Button>
                 </form>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>
 
       {/* Benefits Section */}
       <section className="py-20">
         <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold mb-4">Why List with The Nest?</h2>
             <p className="text-muted-foreground max-w-xl mx-auto">
               We're building the most landlord-friendly HMO platform in the UK.
             </p>
           </div>
 
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {benefits.map((benefit, index) => (
               <Card 
                 key={benefit.title}
                 className="text-center border-border hover:shadow-soft transition-shadow animate-fade-up"
                 style={{ animationDelay: `${index * 100}ms` }}
               >
                 <CardContent className="pt-6">
                   <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                     <benefit.icon className="text-accent" size={24} />
                   </div>
                   <h3 className="font-semibold mb-2">{benefit.title}</h3>
                   <p className="text-sm text-muted-foreground">{benefit.description}</p>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
       </section>
 
       {/* Dashboard Preview */}
       <section className="py-20 bg-secondary/30">
         <div className="container mx-auto px-4">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-3xl font-bold mb-6">Track Every Listing</h2>
               <p className="text-muted-foreground mb-6">
                 Get a clear dashboard showing all your rooms, their status, 
                 views, enquiries, and time-to-let metrics.
               </p>
               <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-3">
                   <CheckCircle2 className="text-success flex-shrink-0" size={20} />
                   <span>Real-time view and enquiry tracking</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <CheckCircle2 className="text-success flex-shrink-0" size={20} />
                   <span>Mark rooms as let with one click</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <CheckCircle2 className="text-success flex-shrink-0" size={20} />
                   <span>Compare performance across properties</span>
                 </li>
               </ul>
               <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                 <Link to="/register">Start Listing for Free</Link>
               </Button>
             </div>
 
             {/* Mock Dashboard Card */}
             <Card className="shadow-soft">
               <CardHeader className="border-b border-border">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-lg">Your Listings</CardTitle>
                   <Badge variant="secondary">3 Active</Badge>
                 </div>
               </CardHeader>
               <CardContent className="p-0">
                 {[
                   { postcode: "M14 5RX", rent: 550, views: 234, enquiries: 12, status: "Active" },
                   { postcode: "M14 6AB", rent: 495, views: 189, enquiries: 8, status: "Active" },
                   { postcode: "M14 4CD", rent: 475, views: 312, enquiries: 15, status: "Let" },
                 ].map((listing, index) => (
                   <div 
                     key={listing.postcode}
                     className={`flex items-center justify-between p-4 ${
                       index < 2 ? "border-b border-border" : ""
                     }`}
                   >
                     <div>
                       <p className="font-medium">{listing.postcode}</p>
                       <p className="text-sm text-muted-foreground">£{listing.rent}/month</p>
                     </div>
                     <div className="flex items-center gap-6 text-sm">
                       <div className="text-center">
                         <p className="font-semibold">{listing.views}</p>
                         <p className="text-muted-foreground">Views</p>
                       </div>
                       <div className="text-center">
                         <p className="font-semibold">{listing.enquiries}</p>
                         <p className="text-muted-foreground">Enquiries</p>
                       </div>
                       <Badge 
                         variant={listing.status === "Active" ? "default" : "secondary"}
                         className={listing.status === "Active" ? "bg-success" : ""}
                       >
                         {listing.status}
                       </Badge>
                     </div>
                   </div>
                 ))}
               </CardContent>
             </Card>
           </div>
         </div>
       </section>
 
       <Footer />
     </div>
   );
 }