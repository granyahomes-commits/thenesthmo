import logoImg from "@/assets/logo.png";

interface LogoProps {
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "default", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-7",
    md: "h-9",
    lg: "h-11",
  };

  return (
    <img
      src={logoImg}
      alt="The Nest HMO"
      className={`${sizeClasses[size]} w-auto ${variant === "white" ? "brightness-0 invert" : ""}`}
    />
  );
}
