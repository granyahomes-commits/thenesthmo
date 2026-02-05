 import { Link, useLocation } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Logo } from "@/components/ui/Logo";
 import { Menu, X } from "lucide-react";
 import { useState } from "react";
 
 const navLinks = [
   { href: "/rooms", label: "Find a Room" },
   { href: "/landlords", label: "List Your Property" },
   { href: "/investors", label: "Market Intelligence" },
 ];
 
 export function Navbar() {
   const location = useLocation();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
   return (
     <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
       <div className="container mx-auto px-4">
         <div className="flex items-center justify-between h-16">
           <Link to="/" className="flex items-center">
             <Logo size="md" />
           </Link>
 
           {/* Desktop Navigation */}
           <div className="hidden md:flex items-center gap-8">
             {navLinks.map((link) => (
               <Link
                 key={link.href}
                 to={link.href}
                 className={`text-sm font-medium transition-colors hover:text-accent ${
                   location.pathname === link.href
                     ? "text-accent"
                     : "text-muted-foreground"
                 }`}
               >
                 {link.label}
               </Link>
             ))}
           </div>
 
           <div className="hidden md:flex items-center gap-3">
             <Button variant="ghost" size="sm" asChild>
               <Link to="/login">Sign In</Link>
             </Button>
             <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
               <Link to="/register">Get Started</Link>
             </Button>
           </div>
 
           {/* Mobile Menu Button */}
           <button
             className="md:hidden p-2"
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           >
             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
         </div>
 
         {/* Mobile Navigation */}
         {mobileMenuOpen && (
           <div className="md:hidden py-4 border-t border-border animate-fade-in">
             <div className="flex flex-col gap-4">
               {navLinks.map((link) => (
                 <Link
                   key={link.href}
                   to={link.href}
                   className={`text-sm font-medium py-2 ${
                     location.pathname === link.href
                       ? "text-accent"
                       : "text-muted-foreground"
                   }`}
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   {link.label}
                 </Link>
               ))}
               <div className="flex gap-3 pt-4 border-t border-border">
                 <Button variant="ghost" size="sm" className="flex-1" asChild>
                   <Link to="/login">Sign In</Link>
                 </Button>
                 <Button size="sm" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                   <Link to="/register">Get Started</Link>
                 </Button>
               </div>
             </div>
           </div>
         )}
       </div>
     </nav>
   );
 }