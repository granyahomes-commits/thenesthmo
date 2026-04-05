import { Card, CardContent } from "@/components/ui/card";
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

const roomTypeLabel: Record<string, string> = { single: "Single", double: "Double", large_double: "Large Double", ensuite: "Ensuite", "large double": "Large Double" };

export function RoomCard({ room, onEnquire }: RoomCardProps) {
  const hasImage = room.images && room.images.length > 0;
  const displayDate = room.available_from ? new Date(room.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Now";

  return (
    <Card className="group overflow-hidden hover:shadow-soft transition-all duration-300 border-border hover:border-accent/30">
      <div className="aspect-video bg-secondary relative overflow-hidden">
        {hasImage ? (
          <img src={room.images[0]} alt={room.title || `Room in ${room.city}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/80"><Home className="text-muted-foreground mb-2" size={32} /><span className="text-xs text-muted-foreground">No photo yet</span></div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground">{roomTypeLabel[room.room_type] || room.room_type}</Badge>
          {room.ensuite && <Badge variant="secondary" className="bg-accent/90 text-accent-foreground"><Bath size={12} className="mr-1" /> Ensuite</Badge>}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">£{Math.round(room.rent_pcm)}<span className="text-muted-foreground text-sm font-normal">/month</span></h3>
            <div className="flex gap-2 mt-1">
              {room.bills_included && <span className="text-xs text-success flex items-center gap-1"><Zap size={12} /> Bills included</span>}
              {room.furnished && <span className="text-xs text-muted-foreground flex items-center gap-1"><Sofa size={12} /> Furnished</span>}
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
