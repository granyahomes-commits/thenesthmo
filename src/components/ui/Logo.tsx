 import { Home } from "lucide-react";
 
 interface LogoProps {
   variant?: "default" | "white";
   size?: "sm" | "md" | "lg";
 }
 
 export function Logo({ variant = "default", size = "md" }: LogoProps) {
   const sizeClasses = {
     sm: "text-lg",
     md: "text-xl",
     lg: "text-2xl",
   };
 
   const iconSizes = {
     sm: 18,
     md: 22,
     lg: 26,
   };
 
   return (
     <div className="flex items-center gap-2">
       <div className={`p-1.5 rounded-lg ${variant === "white" ? "bg-white/20" : "bg-accent"}`}>
         <Home 
           size={iconSizes[size]} 
           className={variant === "white" ? "text-white" : "text-accent-foreground"} 
         />
       </div>
       <span className={`font-bold ${sizeClasses[size]} ${variant === "white" ? "text-white" : "text-foreground"}`}>
         The Nest<span className={variant === "white" ? "text-white/80" : "text-accent"}>HMO</span>
       </span>
     </div>
   );
 }