import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-ink/90 text-paper hover:bg-ink",
        secondary:
          "border-transparent bg-rule-soft text-ink-soft",
        outline: "text-ink-soft border-rule",
        accent:
          "border-transparent bg-accent/15 text-accent",
        warm:
          "border-transparent bg-accent-warm/15 text-accent-warm",
        canonico:
          "border-transparent bg-accent/20 text-accent",
        provvisorio:
          "border-rule-soft bg-paper-soft text-ink-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
