 import { Link } from "react-router-dom";
 import { Logo } from "@/components/ui/Logo";
 
 export function Footer() {
   return (
     <footer className="bg-primary text-primary-foreground">
       <div className="container mx-auto px-4 py-12">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="col-span-1">
             <Logo variant="white" size="md" />
             <p className="mt-4 text-sm text-primary-foreground/70">
               UK's first-party data driven HMO market intelligence platform.
             </p>
           </div>
 
           <div>
             <h4 className="font-semibold mb-4">For Tenants</h4>
             <ul className="space-y-2 text-sm text-primary-foreground/70">
               <li><Link to="/rooms" className="hover:text-accent transition-colors">Search Rooms</Link></li>
               <li><Link to="/how-it-works" className="hover:text-accent transition-colors">How It Works</Link></li>
               <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
             </ul>
           </div>
 
           <div>
             <h4 className="font-semibold mb-4">For Landlords</h4>
             <ul className="space-y-2 text-sm text-primary-foreground/70">
               <li><Link to="/landlords" className="hover:text-accent transition-colors">List Property</Link></li>
               <li><Link to="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
               <li><Link to="/resources" className="hover:text-accent transition-colors">Resources</Link></li>
             </ul>
           </div>
 
           <div>
             <h4 className="font-semibold mb-4">For Investors</h4>
             <ul className="space-y-2 text-sm text-primary-foreground/70">
               <li><Link to="/investors" className="hover:text-accent transition-colors">Market Intelligence</Link></li>
               <li><Link to="/pricing" className="hover:text-accent transition-colors">Subscription Plans</Link></li>
               <li><Link to="/data-policy" className="hover:text-accent transition-colors">Data Policy</Link></li>
             </ul>
           </div>
         </div>
 
         <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-sm text-primary-foreground/60">
             © {new Date().getFullYear()} The Nest HMO. All rights reserved.
           </p>
           <div className="flex gap-6 text-sm text-primary-foreground/60">
             <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
             <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
             <Link to="/gdpr" className="hover:text-accent transition-colors">GDPR</Link>
           </div>
         </div>
       </div>
     </footer>
   );
 }