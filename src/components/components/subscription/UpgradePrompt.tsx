import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import {
  TrendingUp,
  Building2,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string; // What the user tried to access
  context?: "investor" | "landlord";
}

export function UpgradePrompt({
  open,
  onOpenChange,
  feature,
  context = "investor",
}: UpgradePromptProps) {
  const { startCheckout, subscription } = useSubscription();

  const investorPlans = [
    {
      tier: "investor_basic" as const,
      name: "Investor",
      price: "£29",
      period: "/month",
      popular: true,
      features: [
        "Unlimited postcode analytics",
        "Saturation & opportunity scoring",
        "Yield estimates & rent benchmarks",
        "Demand trend charts (30/60/90 day)",
        "HMO licence density data",
        "EPC distribution analytics",
      ],
    },
    {
      tier: "investor_pro" as const,
      name: "Professional",
      price: "£99",
      period: "/month",
      popular: false,
      features: [
        "Everything in Investor",
        "Portfolio tracking (multi-postcode)",
        "Downloadable PDF reports",
        "12-month historical data",
        "AI market commentary",
        "Email alerts on market changes",
        "API access",
      ],
    },
  ];

  const landlordPlan = {
    tier: "landlord_premium" as const,
    name: "Landlord Premium",
    price: "£9.99",
    period: "/room/month",
    features: [
      "Featured listing placement",
      "AI rent guidance (recommended pricing)",
      "Proactive tenant matching",
      "Detailed performance analytics",
      "Competitor benchmarking",
      "Unlimited room listings",
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Lock className="text-accent" size={20} />
            </div>
            <div>
              <DialogTitle>Unlock {feature}</DialogTitle>
              <DialogDescription>
                {context === "investor"
                  ? "Get full access to HMO market intelligence"
                  : "Supercharge your listings and fill rooms faster"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2">
          {/* Free tier info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-3 rounded-lg bg-secondary/50">
            <Zap size={14} />
            <span>
              You're on the <strong>Free</strong> plan —{" "}
              {context === "investor"
                ? "3 postcode lookups per month"
                : "3 room listings"}
            </span>
          </div>

          {context === "investor" ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {investorPlans.map((plan) => (
                <Card
                  key={plan.tier}
                  className={
                    plan.popular
                      ? "border-2 border-accent relative"
                      : "border-border"
                  }
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2.5 left-4 bg-accent text-accent-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp
                        className="text-accent"
                        size={18}
                      />
                      <h3 className="font-semibold">{plan.name}</h3>
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-2 mb-5">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2
                            className="text-success flex-shrink-0 mt-0.5"
                            size={14}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={
                        plan.popular
                          ? "w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                          : "w-full"
                      }
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => startCheckout(plan.tier)}
                    >
                      {plan.popular ? "Get Started" : "Choose Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-accent">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="text-accent" size={18} />
                  <h3 className="font-semibold">{landlordPlan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold">
                    {landlordPlan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {landlordPlan.period}
                  </span>
                </div>
                <ul className="space-y-2 mb-5">
                  {landlordPlan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        className="text-success flex-shrink-0 mt-0.5"
                        size={14}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => startCheckout(landlordPlan.tier)}
                >
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-center text-muted-foreground mt-4">
            Cancel anytime. No contracts. 14-day money-back guarantee.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
