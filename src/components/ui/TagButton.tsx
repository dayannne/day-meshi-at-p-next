import * as React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TagButtonProps extends React.ComponentProps<typeof Button> {
  tagColor?: "primary" | "secondary" | "tertiary" | "neutral";
}

const tagStyles = {
  primary: "border-primary bg-primary-background text-primary hover:bg-primary",
  secondary: "border-secondary bg-secondary-background text-secondary hover:bg-secondary",
  tertiary: "border-tertiary bg-tertiary-background text-tertiary hover:bg-tertiary",
  neutral: "border-neutral bg-neutral-background text-neutral hover:bg-neutral",
};

export function TagButton({ tagColor = "primary", className, children, ...props }: TagButtonProps) {
  return (
    <Button variant="fill" size="tag" className={cn(tagStyles[tagColor], className)} {...props}>
      {children}
    </Button>
  );
}
