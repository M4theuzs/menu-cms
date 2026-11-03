import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva("relative w-full rounded-lg border px-3 py-2.5 text-sm", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      success: "border-green-500/30 bg-green-500/10 text-green-800 dark:text-green-300",
      destructive: "border-destructive/30 bg-destructive/10 text-destructive",
    },
  },
  defaultVariants: { variant: "default" },
})

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

export { Alert }
