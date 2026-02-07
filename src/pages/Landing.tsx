import { Logo } from "@/components/ui/Logo";
import { Home, BarChart3, Building2, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-hero text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto animate-fade-up">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Logo variant="white" size="lg" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Something Big is <span className="text-accent">Coming</span>
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/70 mb-12 max-w-lg mx-auto">
          The UK's first postcode-level HMO market intelligence platform is being built. Stay tuned.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {[
            { icon: BarChart3, label: "Market Intelligence" },
            { icon: Building2, label: "Landlord Tools" },
            { icon: Users, label: "Tenant Search" },
          ].map((item) => (
            <div
              key={item.label}
              className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium"
            >
              <item.icon size={16} className="text-accent" />
              {item.label}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-primary-foreground/20 mx-auto mb-6" />

        <p className="text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} The Nest HMO. All rights reserved.
        </p>
      </div>
    </div>
  );
}
