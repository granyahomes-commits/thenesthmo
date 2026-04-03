import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Subscription {
  tier: "free" | "investor_basic" | "investor_pro" | "landlord_premium";
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface UsageCheck {
  allowed: boolean;
  used: number;
  limit: number;
  tier: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>({
    tier: "free",
    status: "active",
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription({ tier: "free", status: "active", currentPeriodEnd: null, cancelAtPeriodEnd: false });
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (data) {
        setSubscription({
          tier: data.tier,
          status: data.status,
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end,
        });
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [user]);

  // Check if a specific action is allowed under current tier
  const checkUsage = useCallback(
    async (action: string): Promise<UsageCheck> => {
      if (!user) {
        return { allowed: false, used: 0, limit: 0, tier: "free" };
      }

      const { data, error } = await supabase.rpc("check_usage_limit", {
        p_user_id: user.id,
        p_action: action,
      });

      if (error || !data) {
        return { allowed: false, used: 0, limit: 0, tier: "free" };
      }

      return data as UsageCheck;
    },
    [user]
  );

  // Increment usage counter after performing an action
  const recordUsage = useCallback(
    async (action: string): Promise<boolean> => {
      if (!user) return false;

      const { data, error } = await supabase.rpc("increment_usage", {
        p_user_id: user.id,
        p_action: action,
      });

      return !error;
    },
    [user]
  );

  // Start Stripe checkout for an upgrade
  const startCheckout = useCallback(
    async (tier: "investor_basic" | "investor_pro" | "landlord_premium") => {
      if (!user) return;

      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: { tier, return_url: window.location.origin + "/dashboard" },
        }
      );

      if (error) {
        console.error("Checkout error:", error);
        return;
      }

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    [user]
  );

  // Convenience checks
  const isPaid = subscription.tier !== "free";
  const isInvestor = subscription.tier === "investor_basic" || subscription.tier === "investor_pro";
  const isInvestorPro = subscription.tier === "investor_pro";
  const isLandlordPremium = subscription.tier === "landlord_premium";

  // Pricing display
  const pricing = {
    investor_basic: { price: 29, label: "Investor", period: "month" },
    investor_pro: { price: 99, label: "Professional", period: "month" },
    landlord_premium: { price: 9.99, label: "Landlord Premium", period: "room/month" },
  };

  return {
    subscription,
    loading,
    isPaid,
    isInvestor,
    isInvestorPro,
    isLandlordPremium,
    checkUsage,
    recordUsage,
    startCheckout,
    pricing,
  };
}
