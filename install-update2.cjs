// install-update2.js
// Run this from your project root: node install-update2.js
// It creates/updates all the files needed for Update 2

const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ ${filePath}`);
}

console.log('\n=== Installing HMO Hub Update 2 ===\n');

// 1. RoomImageUpload.tsx (NEW)
writeFile('src/components/rooms/RoomImageUpload.tsx', `import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface RoomImageUploadProps {
  roomIndex: number;
  images: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export function RoomImageUpload({ roomIndex, images, onImagesChange, maxImages = 5 }: RoomImageUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useCallback(async (file: File) => {
    if (!user) return null;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file (JPG, PNG, WebP)", variant: "destructive" });
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB", variant: "destructive" });
      return null;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = \`\${user.id}/\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}.\${ext}\`;
    const { data, error } = await supabase.storage.from("room-images").upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: urlData } = supabase.storage.from("room-images").getPublicUrl(data.path);
    return urlData.publicUrl;
  }, [user, toast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) { toast({ title: "Maximum images reached", description: \`Up to \${maxImages} images per room\`, variant: "destructive" }); return; }
    const filesToUpload = files.slice(0, remaining);
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of filesToUpload) {
      const url = await uploadImage(file);
      if (url) newUrls.push(url);
    }
    if (newUrls.length > 0) {
      onImagesChange([...images, ...newUrls]);
      toast({ title: "Images uploaded", description: \`\${newUrls.length} image(s) added\` });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length === 0) return;
    const remaining = maxImages - images.length;
    const filesToUpload = files.slice(0, remaining);
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of filesToUpload) { const url = await uploadImage(file); if (url) newUrls.push(url); }
    if (newUrls.length > 0) onImagesChange([...images, ...newUrls]);
    setUploading(false);
  };

  const removeImage = async (index: number) => {
    const url = images[index];
    const p = url.split("/room-images/")[1];
    if (p) await supabase.storage.from("room-images").remove([p]);
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Room Photos ({images.length}/{maxImages})</label>
      {images.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {images.map((url, index) => (
            <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
              <img src={url} alt={\`Room \${roomIndex + 1} photo \${index + 1}\`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
              {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">Main</span>}
            </div>
          ))}
        </div>
      )}
      {images.length < maxImages && (
        <div onDrop={handleDrop} onDragOver={e => { e.preventDefault(); }} className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors" onClick={() => fileInputRef.current?.click()}>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileSelect} className="hidden" />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 py-2"><Loader2 className="animate-spin text-accent" size={20} /><span className="text-sm text-muted-foreground">Uploading...</span></div>
          ) : (
            <div className="flex flex-col items-center gap-1 py-2"><ImagePlus className="text-muted-foreground" size={24} /><span className="text-sm text-muted-foreground">Click or drag photos here</span><span className="text-xs text-muted-foreground">JPG, PNG or WebP — Max 5MB each</span></div>
          )}
        </div>
      )}
    </div>
  );
}
`);

// 2. RoomCard.tsx (UPDATE - works with real data)
writeFile('src/components/rooms/RoomCard.tsx', `import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bath, Calendar, Zap, Home, Sofa } from "lucide-react";

interface RoomData {
  id: string;
  title: string | null;
  room_type: string;
  rent_pcm: number;
  bills_included: boolean;
  ensuite: boolean;
  furnished: boolean;
  available_from: string | null;
  city: string;
  postcode: string;
  images: string[];
}

interface RoomCardProps {
  room: RoomData;
  onEnquire: (roomId: string) => void;
}

const roomTypeLabel: Record<string, string> = {
  single: "Single", double: "Double", large_double: "Large Double",
  ensuite: "Ensuite", "large double": "Large Double",
};

export function RoomCard({ room, onEnquire }: RoomCardProps) {
  const hasImage = room.images && room.images.length > 0;
  const displayDate = room.available_from
    ? new Date(room.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "Now";

  return (
    <Card className="group overflow-hidden hover:shadow-soft transition-all duration-300 border-border hover:border-accent/30">
      <div className="aspect-video bg-secondary relative overflow-hidden">
        {hasImage ? (
          <img src={room.images[0]} alt={room.title || \`Room in \${room.city}\`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/80">
            <Home className="text-muted-foreground mb-2" size={32} />
            <span className="text-xs text-muted-foreground">No photo yet</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground">{roomTypeLabel[room.room_type] || room.room_type}</Badge>
          {room.ensuite && (<Badge variant="secondary" className="bg-accent/90 text-accent-foreground"><Bath size={12} className="mr-1" /> Ensuite</Badge>)}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">£{Math.round(room.rent_pcm)}<span className="text-muted-foreground text-sm font-normal">/month</span></h3>
            <div className="flex gap-2 mt-1">
              {room.bills_included && (<span className="text-xs text-success flex items-center gap-1"><Zap size={12} /> Bills included</span>)}
              {room.furnished && (<span className="text-xs text-muted-foreground flex items-center gap-1"><Sofa size={12} /> Furnished</span>)}
            </div>
          </div>
        </div>
        {room.title && <p className="text-sm font-medium mb-2">{room.title}</p>}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2"><MapPin size={14} /><span>{room.city}, {room.postcode}</span></div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4"><Calendar size={14} /><span>Available {displayDate}</span></div>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => onEnquire(room.id)}>Enquire Now</Button>
      </CardContent>
    </Card>
  );
}
`);

// 3. useRooms.ts (NEW - fetches from Supabase)
writeFile('src/hooks/useRooms.ts', `import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEventTracking } from "@/hooks/useEventTracking";

export interface RoomListing {
  id: string;
  title: string | null;
  room_type: string;
  rent_pcm: number;
  bills_included: boolean;
  ensuite: boolean;
  furnished: boolean;
  available_from: string | null;
  status: string;
  views_count: number;
  enquiries_count: number;
  description: string | null;
  created_at: string;
  property_id: string;
  address: string;
  city: string;
  postcode: string;
  postcode_district: string;
  images: string[];
}

interface RoomFilters {
  postcode: string;
  maxBudget: number;
  billsIncluded: boolean | null;
  ensuite: boolean | null;
  roomType: string | null;
  city: string | null;
}

const PAGE_SIZE = 12;

export function useRooms() {
  const [rooms, setRooms] = useState<RoomListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<RoomFilters>({ postcode: "", maxBudget: 1200, billsIncluded: null, ensuite: null, roomType: null, city: null });
  const [hasMore, setHasMore] = useState(true);
  const { trackSearch } = useEventTracking();

  const fetchRooms = useCallback(async (filters: RoomFilters, pageNum: number, append = false) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("rooms")
        .select(\`id, title, room_type, rent_pcm, bills_included, ensuite, furnished, available_from, status, views_count, enquiries_count, description, created_at, property_id, properties!inner (address_line_1, city, postcode, postcode_district, status)\`, { count: "exact" })
        .eq("status", "available")
        .eq("properties.status", "active")
        .lte("rent_pcm", filters.maxBudget)
        .order("created_at", { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      if (filters.billsIncluded) query = query.eq("bills_included", true);
      if (filters.ensuite) query = query.eq("ensuite", true);
      if (filters.roomType) query = query.eq("room_type", filters.roomType);
      if (filters.postcode) {
        const s = filters.postcode.trim().toUpperCase();
        query = query.or(\`postcode_district.ilike.%\${s}%,city.ilike.%\${s}%,postcode.ilike.%\${s}%\`, { foreignTable: "properties" });
      }

      const { data, error: qErr, count } = await query;
      if (qErr) throw qErr;

      const transformed: RoomListing[] = (data || []).map((room: any) => ({
        id: room.id, title: room.title, room_type: room.room_type, rent_pcm: room.rent_pcm,
        bills_included: room.bills_included, ensuite: room.ensuite, furnished: room.furnished,
        available_from: room.available_from, status: room.status, views_count: room.views_count,
        enquiries_count: room.enquiries_count, description: room.description, created_at: room.created_at,
        property_id: room.property_id, address: room.properties.address_line_1,
        city: room.properties.city, postcode: room.properties.postcode,
        postcode_district: room.properties.postcode_district, images: [],
      }));

      if (transformed.length > 0) {
        const roomIds = transformed.map(r => r.id);
        const { data: imgData } = await supabase.from("room_images").select("room_id, image_url, display_order").in("room_id", roomIds).order("display_order");
        if (imgData) {
          const imgMap = new Map<string, string[]>();
          for (const img of imgData) { const ex = imgMap.get(img.room_id) || []; ex.push(img.image_url); imgMap.set(img.room_id, ex); }
          for (const room of transformed) room.images = imgMap.get(room.id) || [];
        }
      }

      if (append) setRooms(prev => [...prev, ...transformed]);
      else setRooms(transformed);
      setTotalCount(count || 0);
      setHasMore(transformed.length === PAGE_SIZE);
      if (filters.postcode && pageNum === 0) trackSearch(filters.postcode.toUpperCase(), { maxBudget: filters.maxBudget, resultsCount: count || 0 });
    } catch (err: any) {
      setError(err.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, [trackSearch]);

  useEffect(() => { fetchRooms(currentFilters, 0); }, []);

  const search = useCallback(async (filters: RoomFilters) => { setCurrentFilters(filters); setPage(0); await fetchRooms(filters, 0); }, [fetchRooms]);
  const loadMore = useCallback(async () => { const np = page + 1; setPage(np); await fetchRooms(currentFilters, np, true); }, [page, currentFilters, fetchRooms]);

  return { rooms, loading, error, totalCount, search, loadMore, hasMore };
}
`);

// 4. Rooms.tsx (UPDATE - uses real data)
writeFile('src/pages/Rooms.tsx', `import { useState } from "react";
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
  const [filters, setFilters] = useState({ postcode: "", maxBudget: 800, billsIncluded: null as boolean | null, ensuite: null as boolean | null });
  const { rooms, loading, error, totalCount, search, loadMore, hasMore } = useRooms();

  const handleEnquire = (roomId: string) => {
    if (!user) { toast({ title: "Sign in required", description: "Please sign in or create an account to send enquiries.", variant: "destructive" }); return; }
    toast({ title: "Enquiry Submitted", description: "Your enquiry has been sent to the landlord. They'll be in touch soon!" });
  };

  const handleSearch = () => {
    setMobileFiltersOpen(false);
    search({ postcode: filters.postcode, maxBudget: filters.maxBudget, billsIncluded: filters.billsIncluded, ensuite: filters.ensuite, roomType: null, city: null });
  };

  const handleClear = () => {
    const cleared = { postcode: "", maxBudget: 800, billsIncluded: null as boolean | null, ensuite: null as boolean | null };
    setFilters(cleared);
    search({ postcode: "", maxBudget: 800, billsIncluded: null, ensuite: null, roomType: null, city: null });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect HMO Room</h1>
            <p className="text-primary-foreground/80">Browse verified rooms across the UK. Every tenant on The Nest is verified — no fake enquiries, no timewasters.</p>
          </div>
        </div>
      </section>
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24"><RoomFilters filters={filters} onFilterChange={setFilters} onSearch={handleSearch} onClear={handleClear} /></div>
            </aside>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {loading ? (<span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} />Searching...</span>)
                  : (<><span className="font-semibold text-foreground">{totalCount}</span> {totalCount === 1 ? "room" : "rooms"} found</>)}
                </p>
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild><Button variant="outline" className="lg:hidden"><SlidersHorizontal size={18} className="mr-2" />Filters</Button></SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-md"><SheetHeader><SheetTitle>Search Filters</SheetTitle></SheetHeader><div className="mt-6"><RoomFilters filters={filters} onFilterChange={setFilters} onSearch={handleSearch} onClear={handleClear} /></div></SheetContent>
                </Sheet>
              </div>
              {error && (<div className="text-center py-8 text-destructive"><p>Something went wrong: {error}</p><Button variant="outline" className="mt-4" onClick={handleSearch}>Try again</Button></div>)}
              {!loading && !error && rooms.length > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">{rooms.map(room => (<RoomCard key={room.id} room={room} onEnquire={handleEnquire} />))}</div>
                  {hasMore && (<div className="text-center mt-8"><Button variant="outline" onClick={loadMore} disabled={loading}>{loading ? <><Loader2 className="animate-spin mr-2" size={16} />Loading...</> : "Load More Rooms"}</Button></div>)}
                </>
              ) : !loading && !error ? (
                <div className="text-center py-16">
                  <Search className="mx-auto text-muted-foreground mb-4" size={48} />
                  <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
                  <p className="text-muted-foreground mb-4">{filters.postcode ? \`No available rooms matching "\${filters.postcode}". Try a different area.\` : "No rooms are listed yet. Be the first landlord to list!"}</p>
                  {filters.postcode && <Button variant="outline" onClick={handleClear}>Clear filters</Button>}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
`);

// 5. AddProperty.tsx (UPDATE - with image upload)
writeFile('src/pages/AddProperty.tsx', `import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEventTracking } from "@/hooks/useEventTracking";
import { supabase } from "@/integrations/supabase/client";
import { RoomImageUpload } from "@/components/rooms/RoomImageUpload";
import { Building2, Plus, ArrowLeft, MapPin } from "lucide-react";

interface RoomForm { room_type: string; rent_pcm: string; bills_included: boolean; ensuite: boolean; furnished: boolean; images: string[]; }

export default function AddProperty() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { trackListingCreated } = useEventTracking();
  const [loading, setLoading] = useState(false);
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);
  const [property, setProperty] = useState({ address_line_1: "", address_line_2: "", city: "", postcode: "", property_type: "", total_rooms: 1, bathrooms: 1, hmo_licence_number: "", article_4_area: false, description: "" });
  const [rooms, setRooms] = useState<RoomForm[]>([{ room_type: "double", rent_pcm: "", bills_included: false, ensuite: false, furnished: true, images: [] }]);

  const validatePostcode = async (postcode: string) => {
    if (postcode.length < 5) return;
    try {
      const res = await fetch(\`https://api.postcodes.io/postcodes/\${encodeURIComponent(postcode)}\`);
      const data = await res.json();
      if (data.status === 200) { setPostcodeValid(true); if (data.result.admin_district && !property.city) setProperty(p => ({ ...p, city: data.result.admin_district })); }
      else setPostcodeValid(false);
    } catch { setPostcodeValid(null); }
  };

  const addRoom = () => setRooms([...rooms, { room_type: "double", rent_pcm: "", bills_included: false, ensuite: false, furnished: true, images: [] }]);
  const updateRoom = (i: number, field: string, value: unknown) => { const u = [...rooms]; (u[i] as any)[field] = value; setRooms(u); };
  const removeRoom = (i: number) => { if (rooms.length > 1) setRooms(rooms.filter((_, idx) => idx !== i)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!postcodeValid) { toast({ title: "Invalid postcode", description: "Please enter a valid UK postcode.", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const clean = property.postcode.trim().toUpperCase();
      const parts = clean.split(" ");
      const district = parts[0] || clean;
      const area = district.replace(/[0-9]/g, "");

      const { data: propData, error: propError } = await supabase.from("properties").insert({
        landlord_id: user.id, address_line_1: property.address_line_1, address_line_2: property.address_line_2 || null,
        city: property.city, postcode: clean, postcode_district: district, postcode_area: area,
        total_rooms: rooms.length, bathrooms: property.bathrooms, property_type: property.property_type || null,
        hmo_licence_number: property.hmo_licence_number || null, article_4_area: property.article_4_area,
        description: property.description || null, status: "active",
      }).select().single();
      if (propError) throw propError;

      const roomsWithRent = rooms.filter(r => r.rent_pcm);
      for (let i = 0; i < roomsWithRent.length; i++) {
        const r = roomsWithRent[i];
        const { data: roomData, error: roomError } = await supabase.from("rooms").insert({
          property_id: propData.id, landlord_id: user.id, title: \`Room \${i + 1} - \${r.room_type.replace("_", " ")}\`,
          room_type: r.room_type, rent_pcm: parseFloat(r.rent_pcm), bills_included: r.bills_included,
          ensuite: r.ensuite, furnished: r.furnished, status: "available",
        }).select().single();
        if (roomError) throw roomError;
        if (r.images.length > 0 && roomData) {
          const imgInserts = r.images.map((url, idx) => ({ room_id: roomData.id, image_url: url, display_order: idx }));
          await supabase.from("room_images").insert(imgInserts);
        }
      }
      trackListingCreated(propData.id, district, roomsWithRent.length);
      toast({ title: "Property listed!", description: \`\${property.address_line_1} with \${roomsWithRent.length} room(s) is now live.\` });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Error creating property", description: err.message || "Unknown error", variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground mb-4 -ml-2" onClick={() => navigate("/dashboard")}><ArrowLeft size={18} className="mr-1" /> Back to Dashboard</Button>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><Building2 className="text-accent" size={28} />Add New Property</h1>
          <p className="text-primary-foreground/70 mt-1">List your HMO and start receiving tenant enquiries</p>
        </div>
      </section>
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card><CardHeader><CardTitle>Property Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label htmlFor="a1">Address Line 1 *</Label><Input id="a1" placeholder="e.g. 12 Victoria Street" value={property.address_line_1} onChange={e => setProperty({...property, address_line_1: e.target.value})} required className="mt-1" /></div>
                <div><Label htmlFor="a2">Address Line 2</Label><Input id="a2" placeholder="Flat number (optional)" value={property.address_line_2} onChange={e => setProperty({...property, address_line_2: e.target.value})} className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="pc">Postcode *</Label><div className="relative mt-1"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input id="pc" placeholder="e.g. SL1 3AA" value={property.postcode} onChange={e => { setProperty({...property, postcode: e.target.value}); setPostcodeValid(null); }} onBlur={() => validatePostcode(property.postcode)} className={\`pl-10 \${postcodeValid === true ? "border-green-500" : postcodeValid === false ? "border-red-500" : ""}\`} required /></div>{postcodeValid === false && <p className="text-xs text-destructive mt-1">Invalid UK postcode</p>}</div>
                  <div><Label htmlFor="city">City *</Label><Input id="city" placeholder="Auto-filled from postcode" value={property.city} onChange={e => setProperty({...property, city: e.target.value})} required className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Property Type</Label><Select value={property.property_type} onValueChange={v => setProperty({...property, property_type: v})}><SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="terraced">Terraced</SelectItem><SelectItem value="semi">Semi-Detached</SelectItem><SelectItem value="detached">Detached</SelectItem><SelectItem value="flat">Flat / Apartment</SelectItem><SelectItem value="converted">Converted</SelectItem></SelectContent></Select></div>
                  <div><Label>Bathrooms</Label><Input type="number" min={1} value={property.bathrooms} onChange={e => setProperty({...property, bathrooms: parseInt(e.target.value) || 1})} className="mt-1" /></div>
                </div>
                <div><Label>HMO Licence Number</Label><Input placeholder="Optional" value={property.hmo_licence_number} onChange={e => setProperty({...property, hmo_licence_number: e.target.value})} className="mt-1" /></div>
                <div className="flex items-center justify-between py-2"><Label className="cursor-pointer">Article 4 Direction Area</Label><Switch checked={property.article_4_area} onCheckedChange={c => setProperty({...property, article_4_area: c})} /></div>
              </CardContent>
            </Card>
            <Card><CardHeader><div className="flex items-center justify-between"><CardTitle>Rooms ({rooms.length})</CardTitle><Button type="button" variant="outline" size="sm" onClick={addRoom}><Plus size={16} className="mr-1" /> Add Room</Button></div></CardHeader>
              <CardContent className="space-y-6">
                {rooms.map((room, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border space-y-4">
                    <div className="flex items-center justify-between"><span className="text-sm font-medium">Room {index + 1}</span>{rooms.length > 1 && <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => removeRoom(index)}>Remove</Button>}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Room Type</Label><Select value={room.room_type} onValueChange={v => updateRoom(index, "room_type", v)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="single">Single</SelectItem><SelectItem value="double">Double</SelectItem><SelectItem value="large_double">Large Double</SelectItem><SelectItem value="ensuite">Ensuite Double</SelectItem></SelectContent></Select></div>
                      <div><Label>Monthly Rent (£) *</Label><Input type="number" min={100} placeholder="550" value={room.rent_pcm} onChange={e => updateRoom(index, "rent_pcm", e.target.value)} required className="mt-1" /></div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2"><Switch checked={room.bills_included} onCheckedChange={v => updateRoom(index, "bills_included", v)} /><Label className="text-sm cursor-pointer">Bills included</Label></div>
                      <div className="flex items-center gap-2"><Switch checked={room.ensuite} onCheckedChange={v => updateRoom(index, "ensuite", v)} /><Label className="text-sm cursor-pointer">Ensuite</Label></div>
                      <div className="flex items-center gap-2"><Switch checked={room.furnished} onCheckedChange={v => updateRoom(index, "furnished", v)} /><Label className="text-sm cursor-pointer">Furnished</Label></div>
                    </div>
                    <RoomImageUpload roomIndex={index} images={room.images} onImagesChange={urls => updateRoom(index, "images", urls)} maxImages={5} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>{loading ? "Creating..." : "List Property"}</Button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
`);

console.log('\n=== Update 2 installed successfully! ===');
console.log('Now run: npm run dev');
console.log('');
