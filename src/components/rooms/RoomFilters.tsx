 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { Slider } from "@/components/ui/slider";
 import { Button } from "@/components/ui/button";
 import { Search, X } from "lucide-react";
 
 interface RoomFiltersProps {
   filters: {
     postcode: string;
     maxBudget: number;
     billsIncluded: boolean | null;
     ensuite: boolean | null;
   };
   onFilterChange: (filters: RoomFiltersProps["filters"]) => void;
   onSearch: () => void;
   onClear: () => void;
 }
 
 export function RoomFilters({ filters, onFilterChange, onSearch, onClear }: RoomFiltersProps) {
   return (
     <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
       <div className="flex items-center justify-between mb-6">
         <h2 className="font-semibold text-lg">Search Filters</h2>
         <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-foreground">
           <X size={16} className="mr-1" /> Clear
         </Button>
       </div>
 
       <div className="space-y-6">
         <div>
           <Label htmlFor="postcode" className="text-sm font-medium">Postcode or Area</Label>
           <div className="relative mt-2">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
             <Input
               id="postcode"
               placeholder="e.g. M14 or Fallowfield"
               value={filters.postcode}
               onChange={(e) => onFilterChange({ ...filters, postcode: e.target.value })}
               className="pl-10"
             />
           </div>
         </div>
 
         <div>
           <div className="flex justify-between mb-2">
             <Label className="text-sm font-medium">Max Budget</Label>
             <span className="text-sm text-muted-foreground">£{filters.maxBudget}/month</span>
           </div>
           <Slider
             value={[filters.maxBudget]}
             onValueChange={([value]) => onFilterChange({ ...filters, maxBudget: value })}
             min={200}
             max={1200}
             step={25}
             className="w-full"
           />
         </div>
 
         <div className="flex items-center justify-between">
           <Label htmlFor="bills" className="text-sm font-medium cursor-pointer">Bills Included Only</Label>
           <Switch
             id="bills"
             checked={filters.billsIncluded === true}
             onCheckedChange={(checked) => 
               onFilterChange({ ...filters, billsIncluded: checked ? true : null })
             }
           />
         </div>
 
         <div className="flex items-center justify-between">
           <Label htmlFor="ensuite" className="text-sm font-medium cursor-pointer">Ensuite Only</Label>
           <Switch
             id="ensuite"
             checked={filters.ensuite === true}
             onCheckedChange={(checked) => 
               onFilterChange({ ...filters, ensuite: checked ? true : null })
             }
           />
         </div>
 
         <Button 
           className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
           onClick={onSearch}
         >
           <Search size={18} className="mr-2" />
           Search Rooms
         </Button>
       </div>
     </div>
   );
 }