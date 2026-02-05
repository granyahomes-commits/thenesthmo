 import { Card, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Room } from "@/data/mockData";
 import { MapPin, Bath, Calendar, Zap } from "lucide-react";
 import { format } from "date-fns";
 
 interface RoomCardProps {
   room: Room;
   onEnquire: (roomId: string) => void;
 }
 
 export function RoomCard({ room, onEnquire }: RoomCardProps) {
   const roomTypeLabel = {
     single: "Single",
     double: "Double",
     "large double": "Large Double",
   };
 
   return (
     <Card className="group overflow-hidden hover:shadow-soft transition-all duration-300 border-border hover:border-accent/30">
       <div className="aspect-video bg-secondary relative overflow-hidden">
         <img
           src={room.images[0]}
           alt={`Room in ${room.area}`}
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
         />
         <div className="absolute top-3 left-3 flex gap-2">
           <Badge className="bg-primary text-primary-foreground">
             {roomTypeLabel[room.roomType]}
           </Badge>
           {room.ensuite && (
             <Badge variant="secondary" className="bg-accent/90 text-accent-foreground">
               <Bath size={12} className="mr-1" /> Ensuite
             </Badge>
           )}
         </div>
       </div>
       <CardContent className="p-4">
         <div className="flex justify-between items-start mb-3">
           <div>
             <h3 className="font-semibold text-lg">£{room.rent}<span className="text-muted-foreground text-sm font-normal">/month</span></h3>
             {room.billsIncluded && (
               <span className="text-xs text-success flex items-center gap-1">
                 <Zap size={12} /> Bills included
               </span>
             )}
           </div>
         </div>
 
         <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
           <MapPin size={14} />
           <span>{room.area}</span>
         </div>
 
         <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
           <Calendar size={14} />
           <span>Available {format(room.available, "d MMM yyyy")}</span>
         </div>
 
         <Button 
           className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
           onClick={() => onEnquire(room.id)}
         >
           Enquire Now
         </Button>
       </CardContent>
     </Card>
   );
 }