import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Search,
  Building2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const roles = [
  {
    value: "tenant",
    label: "Tenant",
    description: "Search and enquire about HMO rooms",
    icon: Search,
  },
  {
    value: "landlord",
    label: "Landlord",
    description: "List properties and manage rooms",
    icon: Building2,
  },
  {
    value: "investor",
    label: "Investor",
    description: "Access market intelligence and analytics",
    icon: TrendingUp,
  },
];

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "tenant",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      role: formData.role,
    });

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Account created!",
      description: "Check your email to confirm your account, then sign in.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg shadow-soft">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-accent" size={24} />
            </div>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Join the UK's smartest HMO platform — free to get started
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <Label className="mb-3 block">I am a...</Label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, role: role.value })
                      }
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border text-center transition-all ${
                        formData.role === role.value
                          ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                          : "border-border hover:border-accent/30 hover:bg-secondary/50"
                      }`}
                    >
                      {formData.role === role.value && (
                        <CheckCircle2
                          className="absolute top-2 right-2 text-accent"
                          size={16}
                        />
                      )}
                      <role.icon
                        className={
                          formData.role === role.value
                            ? "text-accent"
                            : "text-muted-foreground"
                        }
                        size={24}
                      />
                      <span className="text-sm font-medium">{role.label}</span>
                      <span className="text-xs text-muted-foreground leading-tight">
                        {role.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative mt-1">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Free Account"}
              </Button>
            </form>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
