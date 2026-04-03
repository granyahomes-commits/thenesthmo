import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface VerificationState {
  phoneVerified: boolean;
  idVerified: boolean;
  verificationLevel: string;
  loading: boolean;
}

export function useVerification() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<VerificationState>({
    phoneVerified: profile?.phone_verified || false,
    idVerified: profile?.id_verified || false,
    verificationLevel: profile?.verification_level || "unverified",
    loading: false,
  });

  // Step 1: Request SMS OTP
  const requestPhoneOTP = async (phoneNumber: string) => {
    if (!user) return { error: "Not authenticated" };
    setState((s) => ({ ...s, loading: true }));

    try {
      // Call Supabase Edge Function to send OTP via Twilio/MessageBird
      const { data, error } = await supabase.functions.invoke(
        "send-phone-otp",
        {
          body: { phone_number: phoneNumber },
        }
      );

      if (error) throw error;

      toast({
        title: "Code sent",
        description: `We've sent a 6-digit code to ${phoneNumber}`,
      });

      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send code";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return { error: message };
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  // Step 2: Verify OTP code
  const verifyPhoneOTP = async (phoneNumber: string, code: string) => {
    if (!user) return { error: "Not authenticated" };
    setState((s) => ({ ...s, loading: true }));

    try {
      const { data, error } = await supabase.functions.invoke(
        "verify-phone-otp",
        {
          body: { phone_number: phoneNumber, otp_code: code },
        }
      );

      if (error) throw error;

      // Update local state
      setState((s) => ({
        ...s,
        phoneVerified: true,
        verificationLevel: "phone_verified",
      }));

      toast({
        title: "Phone verified!",
        description: "Your phone number has been verified. You can now send enquiries.",
      });

      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid code";
      toast({
        title: "Verification failed",
        description: message,
        variant: "destructive",
      });
      return { error: message };
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  // Check if user can send enquiries (must be at least phone_verified)
  const canSendEnquiry = (): boolean => {
    return state.phoneVerified || state.idVerified;
  };

  // Get verification badge info
  const getVerificationBadge = () => {
    if (state.idVerified) {
      return { level: "ID Verified", color: "bg-success", icon: "shield-check" };
    }
    if (state.phoneVerified) {
      return { level: "Verified", color: "bg-blue-500", icon: "phone" };
    }
    return { level: "Unverified", color: "bg-muted", icon: "alert-circle" };
  };

  return {
    ...state,
    requestPhoneOTP,
    verifyPhoneOTP,
    canSendEnquiry,
    getVerificationBadge,
  };
}
