import { useState } from "react";
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

  const validatePostcode = async (pc: string) => {
    if (pc.length < 5) return;
    try { const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`); const d = await r.json();
      if (d.status === 200) { setPostcodeValid(true); if (d.result.admin_district && !property.city) setProperty(p => ({...p, city: d.result.admin_district})); } else setPostcodeValid(false);
    } catch { setPostcodeValid(null); }
  };

  const addRoom = () => setRooms([...rooms, { room_type: "double", rent_pcm: "", bills_included: false, ensuite: false, furnished: true, images: [] }]);
  const updateRoom = (i: number, field: string, value: unknown) => { const u = [...rooms]; (u[i] as any)[field] = value; setRooms(u); };
  const removeRoom = (i: number) => { if (rooms.length > 1) setRooms(rooms.filter((_,idx) => idx !== i)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!user) return;
    if (!postcodeValid) { toast({ title: "Invalid postcode", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const clean = property.postcode.trim().toUpperCase();
      const district = clean.split(" ")[0] || clean;
      const area = district.replace(/[0-9]/g, "");
      const { data: propData, error: propError } = await supabase.from("properties").insert({
        landlord_id: user.id, address_line_1: property.address_line_1, address_line_2: property.address_line_2 || null,
        city: property.city, postcode: clean, postcode_district: district, postcode_area: area,
        total_rooms: rooms.length, bathrooms: property.bathrooms, property_type: property.property_type || null,
        hmo_licence_number: property.hmo_licence_number || null, article_4_area: property.article_4_area, status: "active",
      }).select().single();
      if (propError) throw propError;
      const valid = rooms.filter(r => r.rent_pcm);
      for (let i = 0; i < valid.length; i++) {
        const r = valid[i];
        const { data: roomData, error: roomErr } = await supabase.from("rooms").insert({
          property_id: propData.id, landlord_id: user.id, title: `Room ${i+1} - ${r.room_type.replace('_',' ')}`,
          room_type: r.room_type, rent_pcm: parseFloat(r.rent_pcm), bills_included: r.bills_included,
          ensuite: r.ensuite, furnished: r.furnished, status: "available",
        }).select().single();
        if (roomErr) throw roomErr;
        if (r.images.length > 0 && roomData) {
          await supabase.from("room_images").insert(r.images.map((url, idx) => ({ room_id: roomData.id, image_url: url, display_order: idx })));
        }
      }
      trackListingCreated(propData.id, district, valid.length);
      toast({ title: "Property listed!", description: `${property.address_line_1} with ${valid.length} room(s) is now live.` });
      navigate("/dashboard");
    } catch (err: any) { toast({ title: "Error", description: err.message, variant: "destructive" }); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="bg-primary text-primary-foreground py-8"><div className="container mx-auto px-4">
        <Button variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground mb-4 -ml-2" onClick={() => navigate("/dashboard")}><ArrowLeft size={18} className="mr-1" /> Back to Dashboard</Button>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><Building2 className="text-accent" size={28} />Add New Property</h1>
      </div></section>
      <section className="flex-1 py-8"><div className="container mx-auto px-4 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card><CardHeader><CardTitle>Property Details</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Address Line 1 *</Label><Input placeholder="e.g. 12 Victoria Street" value={property.address_line_1} onChange={e => setProperty({...property, address_line_1: e.target.value})} required className="mt-1" /></div>
            <div><Label>Address Line 2</Label><Input placeholder="Optional" value={property.address_line_2} onChange={e => setProperty({...property, address_line_2: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Postcode *</Label><div className="relative mt-1"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input placeholder="e.g. SL1 3AA" value={property.postcode} onChange={e => { setProperty({...property, postcode: e.target.value}); setPostcodeValid(null); }} onBlur={() => validatePostcode(property.postcode)} className={`pl-10 ${postcodeValid === true ? 'border-green-500' : postcodeValid === false ? 'border-red-500' : ''}`} required /></div>{postcodeValid === false && <p className="text-xs text-destructive mt-1">Invalid postcode</p>}</div>
              <div><Label>City *</Label><Input placeholder="Auto-filled" value={property.city} onChange={e => setProperty({...property, city: e.target.value})} required className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Property Type</Label><Select value={property.property_type} onValueChange={v => setProperty({...property, property_type: v})}><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="terraced">Terraced</SelectItem><SelectItem value="semi">Semi-Detached</SelectItem><SelectItem value="detached">Detached</SelectItem><SelectItem value="flat">Flat</SelectItem></SelectContent></Select></div>
              <div><Label>Bathrooms</Label><Input type="number" min={1} value={property.bathrooms} onChange={e => setProperty({...property, bathrooms: parseInt(e.target.value)||1})} className="mt-1" /></div>
            </div>
            <div><Label>HMO Licence Number</Label><Input placeholder="Optional" value={property.hmo_licence_number} onChange={e => setProperty({...property, hmo_licence_number: e.target.value})} className="mt-1" /></div>

<div><Label>Property Description</Label><textarea placeholder="Describe your property - location, transport links, amenities nearby..." value={property.description} onChange={e => setProperty({...property, description: e.target.value})} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" /></div>

            <div className="flex items-center justify-between py-2"><Label className="cursor-pointer">Article 4 Area</Label><Switch checked={property.article_4_area} onCheckedChange={c => setProperty({...property, article_4_area: c})} /></div>
          </CardContent></Card>

          <Card><CardHeader><div className="flex items-center justify-between"><CardTitle>Rooms ({rooms.length})</CardTitle><Button type="button" variant="outline" size="sm" onClick={addRoom}><Plus size={16} className="mr-1" /> Add Room</Button></div></CardHeader>
          <CardContent className="space-y-6">
            {rooms.map((room, index) => (
              <div key={index} className="p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm font-medium">Room {index + 1}</span>{rooms.length > 1 && <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => removeRoom(index)}>Remove</Button>}</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Room Type</Label><Select value={room.room_type} onValueChange={v => updateRoom(index, "room_type", v)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="single">Single</SelectItem><SelectItem value="double">Double</SelectItem><SelectItem value="large_double">Large Double</SelectItem><SelectItem value="ensuite">Ensuite</SelectItem></SelectContent></Select></div>
                  <div><Label>Monthly Rent (£) *</Label><Input type="number" min={100} placeholder="550" value={room.rent_pcm} onChange={e => updateRoom(index, "rent_pcm", e.target.value)} required className="mt-1" /></div>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2"><Switch checked={room.bills_included} onCheckedChange={v => updateRoom(index, "bills_included", v)} /><Label className="text-sm">Bills included</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={room.ensuite} onCheckedChange={v => updateRoom(index, "ensuite", v)} /><Label className="text-sm">Ensuite</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={room.furnished} onCheckedChange={v => updateRoom(index, "furnished", v)} /><Label className="text-sm">Furnished</Label></div>
                </div>
                <RoomImageUpload roomIndex={index} images={room.images} onImagesChange={urls => updateRoom(index, "images", urls)} maxImages={5} />
              </div>
            ))}
          </CardContent></Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>{loading ? "Creating..." : "List Property"}</Button>
          </div>
        </form>
      </div></section>
      <Footer />
    </div>
  );
}
