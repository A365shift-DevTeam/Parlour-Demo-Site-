import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export const buttonStyles = {
  primary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
  secondary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-charcoal/15 bg-white/80 px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-rose-400 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
  ghost:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-charcoal transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonStyles;
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonStyles[variant], className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-rose-600", className)}>
      <span className="h-px w-8 bg-champagne-500" />
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
      )}
      <h2 className="font-display text-4xl font-semibold leading-[0.98] tracking-[-0.02em] text-charcoal sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 max-w-2xl text-base leading-7 text-ink/80", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}

export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-h-7 items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700", className)}>
      {children}
    </span>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-charcoal/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-4xl bg-canvas p-5 shadow-lift sm:rounded-4xl sm:p-7",
              className,
            )}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 id="dialog-title" className="font-display text-3xl font-semibold text-charcoal">
                {title}
              </h2>
              <Button variant="ghost" className="size-11 shrink-0 px-0" onClick={onClose} aria-label="Close dialog">
                <X size={20} />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-charcoal/15 bg-white/60 p-8 text-center">
      <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-rose-50 text-rose-600">
        {icon}
      </div>
      <h3 className="font-display text-2xl font-semibold text-charcoal">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/70">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-charcoal/8", className)} />;
}
