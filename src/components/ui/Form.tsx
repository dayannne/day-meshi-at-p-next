"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";

const FormItemContext = React.createContext<{ id: string } | null>(null);
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext) || {};

  return <Label ref={ref} className={cn(className)} htmlFor={id} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot.Root>,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => {
  const { id } = React.useContext(FormItemContext) || {};

  return (
    <Slot.Root ref={ref} id={id} aria-describedby={`${id}-description ${id}-message`} {...props} />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext) || {};

  return (
    <p
      ref={ref}
      id={`${id}-description`}
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext) || {};

  if (!children) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={`${id}-message`}
      className={cn("text-sm font-medium text-red-600", className)}
      {...props}
    >
      {children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export { FormItem, FormLabel, FormControl, FormDescription, FormMessage };
