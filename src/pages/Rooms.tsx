 import { useState, useMemo } from "react";
 import { Navbar } from "@/components/layout/Navbar";
 import { Footer } from "@/components/layout/Footer";
 import { RoomCard } from "@/components/rooms/RoomCard";
 import { RoomFilters } from "@/components/rooms/RoomFilters";
 import { mockRooms } from "@/data/mockData";
 import { useToast } from "@/hooks/use-toast";
 import { Search, SlidersHorizontal } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from "@/components/ui/sheet";
 
 export default function Rooms() {
   const { toast } = useToast();
   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
   const [filters, setFilters] = useState({
     postcode: "",
     maxBudget: 800,
     billsIncluded: null as boolean | null,
     ensuite: null as boolean | null,
   });
 
   const filteredRooms = useMemo(() => {
     return mockRooms.filter((room) => {
       if (room.status !== "active") return false;
       if (room.rent > filters.maxBudget) return false;
       if (filters.billsIncluded && !room.billsIncluded) return false;
       if (filters.ensuite && !room.ensuite) return false;
       if (filters.postcode) {
         const searchTerm = filters.postcode.toLowerCase();
         const matchesPostcode = room.postcode.toLowerCase().includes(searchTerm);
         const matchesArea = room.area.toLowerCase().includes(searchTerm);
         if (!matchesPostcode && !matchesArea) return false;
       }
       return true;
     });
   }, [filters]);
 
   const handleEnquire = (roomId: string) => {
     toast({
       title: "Enquiry Submitted",
       description: "Your enquiry has been sent to the landlord. They'll be in touch soon!",
     });
   };
 
   const handleSearch = () => {
     setMobileFiltersOpen(false);
     toast({
       title: "Search Updated",
       description: `Found ${filteredRooms.length} rooms matching your criteria.`,
     });
   };
 
   const handleClear = () => {
     setFilters({
       postcode: "",
       maxBudget: 800,
       billsIncluded: null,
       ensuite: null,
     });
   };
 
   return (
     <div className="min-h-screen flex flex-col bg-background">
       <Navbar />
 
       {/* Hero Section */}
       <section className="bg-primary text-primary-foreground py-12">
         <div className="container mx-auto px-4">
           <div className="max-w-2xl">
             <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect HMO Room</h1>
             <p className="text-primary-foreground/80">
               Browse verified rooms across the UK. Filter by location, budget, and amenities to find your next home.
             </p>
           </div>
         </div>
       </section>
 
       {/* Main Content */}
       <section className="flex-1 py-8">
         <div className="container mx-auto px-4">
           <div className="flex gap-8">
             {/* Desktop Filters */}
             <aside className="hidden lg:block w-80 flex-shrink-0">
               <div className="sticky top-24">
                 <RoomFilters
                   filters={filters}
                   onFilterChange={setFilters}
                   onSearch={handleSearch}
                   onClear={handleClear}
                 />
               </div>
             </aside>
 
             {/* Room Listings */}
             <div className="flex-1">
               <div className="flex items-center justify-between mb-6">
                 <p className="text-muted-foreground">
                   <span className="font-semibold text-foreground">{filteredRooms.length}</span> rooms found
                 </p>
 
                 {/* Mobile Filters Button */}
                 <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                   <SheetTrigger asChild>
                     <Button variant="outline" className="lg:hidden">
                       <SlidersHorizontal size={18} className="mr-2" />
                       Filters
                     </Button>
                   </SheetTrigger>
                   <SheetContent side="left" className="w-full sm:max-w-md">
                     <SheetHeader>
                       <SheetTitle>Search Filters</SheetTitle>
                     </SheetHeader>
                     <div className="mt-6">
                       <RoomFilters
                         filters={filters}
                         onFilterChange={setFilters}
                         onSearch={handleSearch}
                         onClear={handleClear}
                       />
                     </div>
                   </SheetContent>
                 </Sheet>
               </div>
 
               {filteredRooms.length > 0 ? (
                 <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                   {filteredRooms.map((room) => (
                     <RoomCard key={room.id} room={room} onEnquire={handleEnquire} />
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-16">
                   <Search className="mx-auto text-muted-foreground mb-4" size={48} />
                   <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
                   <p className="text-muted-foreground">
                     Try adjusting your filters or search in a different area.
                   </p>
                 </div>
               )}
             </div>
           </div>
         </div>
       </section>
 
       <Footer />
     </div>
   );
 }