import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldCheck, Phone, AlertCircle } from "lucide-react";

interface VerificationBadgeProps {
  level: "unverified" | "email_verified" | "phone_verified" | "id_verified" | "fully_verified";
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function VerificationBadge({
  level,
  size = "sm",
  showLabel = true,
}: VerificationBadgeProps) {
  const config = {
    unverified: {
      label: "Unverified",
      tooltip: "This user has not verified their identity",
      className: "bg-muted text-muted-foreground",
      icon: AlertCircle,
    },
    email_verified: {
      label: "Email Verified",
      tooltip: "Email address confirmed",
      className: "bg-muted text-muted-foreground",
      icon: AlertCircle,
    },
    phone_verified: {
      label: "Verified",
      tooltip: "Phone number verified — genuine user",
      className: "bg-blue-500/10 text-blue-600",
      icon: Phone,
    },
    id_verified: {
      label: "ID Verified",
      tooltip: "Government ID checked and verified",
      className: "bg-success/10 text-green-700",
      icon: ShieldCheck,
    },
    fully_verified: {
      label: "Fully Verified",
      tooltip: "Identity, income, and references verified",
      className: "bg-success/10 text-green-700",
      icon: ShieldCheck,
    },
  };

  const c = config[level] || config.unverified;
  const Icon = c.icon;
  const iconSize = size === "sm" ? 12 : 14;

  // Don't show badge for unverified / email_verified (those are default states)
  if (level === "unverified" || level === "email_verified") {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="secondary" className={`${c.className} gap-1 ${size === "sm" ? "text-xs py-0" : "text-xs py-0.5"}`}>
          <Icon size={iconSize} />
          {showLabel && <span>{c.label}</span>}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{c.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
