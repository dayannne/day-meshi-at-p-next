import * as React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TagButtonProps extends React.ComponentProps<typeof Button> {
  tagColor?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "neutral"
    | "primary_outline"
    | "secondary_outline"
    | "tertiary_outline"
    | "neutral_outline";
  isActive?: boolean;
}

const tagStyles = {
  primary: {
    base: "border-primary bg-primary-background text-primary hover:bg-primary",
    active: "bg-primary text-white",
  },
  secondary: {
    base: "border-secondary bg-secondary-background text-secondary hover:bg-secondary",
    active: "bg-secondary text-white",
  },
  tertiary: {
    base: "border-tertiary bg-tertiary-background text-tertiary hover:bg-tertiary",
    active: "bg-tertiary text-white",
  },
  neutral: {
    base: "border-neutral bg-neutral-background text-neutral hover:bg-neutral",
    active: "bg-neutral text-white",
  },
  primary_outline: {
    base: "border-primary bg-white text-primary hover:bg-primary",
    active: "bg-primary text-white",
  },
  secondary_outline: {
    base: "border-secondary bg-white text-secondary hover:bg-secondary",
    active: "bg-secondary text-white",
  },
  tertiary_outline: {
    base: "border-tertiary bg-white text-tertiary hover:bg-tertiary",
    active: "bg-tertiary text-white",
  },
  neutral_outline: {
    base: "border-neutral bg-white text-neutral hover:bg-neutral",
    active: "bg-neutral text-white",
  },
};

export function TagButton({
  tagColor = "primary",
  isActive = false,
  className,
  children,
  ...props
}: TagButtonProps) {
  return (
    <Button
      variant="fill"
      size="tag"
      className={cn(tagStyles[tagColor].base, isActive && tagStyles[tagColor].active, className)}
      {...props}
    >
      {children}
    </Button>
  );
}
