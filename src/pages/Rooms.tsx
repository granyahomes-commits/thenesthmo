import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomFilters } from "@/components/rooms/RoomFilters";
import { useRooms } from "@/hooks/useRooms";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Rooms() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ postcode: "", maxBudget: 800, billsIncluded: null as boolean|null, ensuite: null as boolean|null });
  const { rooms, loading, error, totalCount, search, loadMore, hasMore } = useRooms();

  const handleEnquire = (roomId: string) => {
    if (!user) { toast({ title: "Sign in required", description: "Please sign in to send enquiries.", variant: "destructive" }); return; }
    toast({ title: "Enquiry Submitted", description: "Your enquiry has been sent to the landlord." });
  };
  const handleSearch = () => { setMobileFiltersOpen(false); search({ postcode: filters.postcode, maxBudget: filters.maxBudget, billsIncluded: filters.billsIncluded, ensuite: filters.ensuite, roomType: null, city: null }); };
  const handleClear = () => { const c = { postcode: "", maxBudget: 800, billsIncluded: null as boolean|null, ensuite: null as boolean|null }; setFilters(c); search({ ...c, roomType: null, city: null }); };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="bg-primary text-primary-foreground py-12"><div className="container mx-auto px-4"><div className="max-w-2xl"><h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect HMO Room</h1><p className="text-primary-foreground/80">Browse verified rooms across the UK. Every tenant on The Nest is verified.</p></div></div></section>
      <section className="flex-1 py-8"><div className="container mx-auto px-4"><div className="flex gap-8">
        <aside className="hidden lg:block w-80 flex-shrink-0"><div className="sticky top-24"><RoomFilters filters={filters} onFilterChange={setFilters} onSearch={handleSearch} onClear={handleClear} /></div></aside>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">{loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} />Searching...</span> : <><span className="font-semibold text-foreground">{totalCount}</span> rooms found</>}</p>
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}><SheetTrigger asChild><Button variant="outline" className="lg:hidden"><SlidersHorizontal size={18} className="mr-2" />Filters</Button></SheetTrigger><SheetContent side="left" className="w-full sm:max-w-md"><SheetHeader><SheetTitle>Search Filters</SheetTitle></SheetHeader><div className="mt-6"><RoomFilters filters={filters} onFilterChange={setFilters} onSearch={handleSearch} onClear={handleClear} /></div></SheetContent></Sheet>
          </div>
          {!loading && !error && rooms.length > 0 ? (
            <><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">{rooms.map(room => <RoomCard key={room.id} room={room} onEnquire={handleEnquire} />)}</div>
            {hasMore && <div className="text-center mt-8"><Button variant="outline" onClick={loadMore} disabled={loading}>Load More</Button></div>}</>
          ) : !loading && !error ? (
            <div className="text-center py-16"><Search className="mx-auto text-muted-foreground mb-4" size={48} /><h3 className="text-lg font-semibold mb-2">No rooms found</h3><p className="text-muted-foreground mb-4">{filters.postcode ? "Try a different area or adjust your filters." : "No rooms listed yet."}</p>{filters.postcode && <Button variant="outline" onClick={handleClear}>Clear filters</Button>}</div>
          ) : null}
        </div>
      </div></div></section>
      <Footer />
    </div>
  );
}
