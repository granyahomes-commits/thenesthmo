import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useVerification } from "@/hooks/useVerification";
import { Phone, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

interface PhoneVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export function PhoneVerificationModal({
  open,
  onOpenChange,
  onVerified,
}: PhoneVerificationModalProps) {
  const { requestPhoneOTP, verifyPhoneOTP, loading } = useVerification();
  const [step, setStep] = useState<"phone" | "code" | "success">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const handleSendCode = async () => {
    // Basic UK phone validation
    const cleanPhone = phoneNumber.replace(/\s/g, "");
    if (!cleanPhone.match(/^(\+44|0)7\d{9}$/)) {
      return; // Let the form validation handle this
    }

    const { error } = await requestPhoneOTP(cleanPhone);
    if (!error) {
      setStep("code");
    }
  };

  const handleVerifyCode = async () => {
    if (otpCode.length !== 6) return;

    const cleanPhone = phoneNumber.replace(/\s/g, "");
    const { error } = await verifyPhoneOTP(cleanPhone, otpCode);
    if (!error) {
      setStep("success");
      setTimeout(() => {
        onVerified();
        onOpenChange(false);
        // Reset for next time
        setStep("phone");
        setPhoneNumber("");
        setOtpCode("");
      }, 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "phone" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <ShieldCheck className="text-accent" size={20} />
                </div>
                <div>
                  <DialogTitle>Verify Your Identity</DialogTitle>
                  <DialogDescription className="mt-1">
                    One quick step to send enquiries
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                <p className="text-sm font-medium">
                  Why do we verify tenants?
                </p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      className="text-success flex-shrink-0 mt-0.5"
                      size={14}
                    />
                    <span>Landlords only receive genuine enquiries</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      className="text-success flex-shrink-0 mt-0.5"
                      size={14}
                    />
                    <span>No fake accounts or spam messages</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      className="text-success flex-shrink-0 mt-0.5"
                      size={14}
                    />
                    <span>
                      You get a{" "}
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-600 text-xs py-0"
                      >
                        Verified
                      </Badge>{" "}
                      badge on your profile
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">UK Mobile Number</Label>
                <div className="relative mt-1">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07XXX XXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    pattern="^(\+44|0)7\d{9}$"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send a 6-digit code via SMS
                </p>
              </div>

              <Button
                onClick={handleSendCode}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={loading || phoneNumber.replace(/\s/g, "").length < 11}
              >
                {loading ? "Sending..." : "Send Verification Code"}
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </>
        )}

        {step === "code" && (
          <>
            <DialogHeader>
              <DialogTitle>Enter Verification Code</DialogTitle>
              <DialogDescription>
                We sent a 6-digit code to {phoneNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtpCode(val);
                  }}
                  className="mt-1 text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleVerifyCode}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={loading || otpCode.length !== 6}
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>

              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => {
                    setOtpCode("");
                    handleSendCode();
                  }}
                  disabled={loading}
                >
                  Didn't receive it? Resend code
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => setStep("phone")}
              >
                Change phone number
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-success" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">You're Verified!</h3>
            <p className="text-muted-foreground text-sm">
              You can now send enquiries to landlords. Your profile shows a
              verified badge.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
