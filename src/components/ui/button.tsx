import type { ComponentType, ReactNode, SVGProps } from "react";
import Link from "next/link";
import { WhatsAppIcon } from "../icons";

export type ButtonVariant = "primary" | "secondary" | "secondary-inverted" | "whatsapp";
export type ButtonSize = "sm" | "md";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const BASE =
  "inline-flex items-center justify-center gap-space-1 rounded-xl text-small font-semibold transition-colors disabled:opacity-60";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-10 px-space-3",
  md: "h-12 px-space-4",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-(--color-primary) text-(--color-surface) shadow-lg shadow-black/20 transition-opacity hover:opacity-90",
  // For light/white page backgrounds — a bordered neutral button.
  secondary:
    "border border-(--color-border) text-(--color-text-primary) hover:border-(--color-primary) hover:text-(--color-primary)",
  // Same shape, tuned for dark hero/overlay backgrounds (white border/text).
  "secondary-inverted": "border border-white/40 text-white/90 hover:border-white hover:text-white",
  whatsapp: "bg-(--color-whatsapp) text-white transition-opacity hover:opacity-90",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconComponent;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
};

type SubmitButtonProps = CommonProps & {
  type: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
};

export type ButtonProps = LinkButtonProps | SubmitButtonProps;

function classes(variant: ButtonVariant, size: ButtonSize, extra?: string) {
  return [BASE, SIZE_CLASSES[size], VARIANT_CLASSES[variant], extra].filter(Boolean).join(" ");
}

/**
 * Shared button system (UI Design System Upgrade, 2026-08-05). Every
 * variant here already existed independently, hand-copied at ~68 call
 * sites across the app (header, hero, forms, cards, CTA bars) with
 * small, accidental drift between them (h-10 vs h-11 for the "same"
 * secondary action, disabled: present on some primary buttons and not
 * others). This names the 4 variants that already existed and gives
 * them one definition — not a new visual language.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon: Icon, className, children } = props;
  const content = (
    <>
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {children}
    </>
  );

  if ("href" in props) {
    const { href, external } = props;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes(variant, size, className)}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes(variant, size, className)} onClick={props.onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
      className={classes(variant, size, className)}
    >
      {content}
    </button>
  );
}

/** Convenience wrapper — a `Button` pre-set to the WhatsApp variant and icon,
 *  since that pairing is used everywhere WhatsApp appears as an action. */
export function WhatsAppButton(props: Omit<LinkButtonProps, "icon" | "variant">) {
  return <Button {...props} variant="whatsapp" icon={WhatsAppIcon} external />;
}

/**
 * Icon-only circular button (phone/WhatsApp shortcuts in the header,
 * mobile CTA bar). 44px minimum tap target per this project's own
 * mobile-accessibility standard (see mobile-cta-bar.tsx).
 */
export function IconButton({
  href,
  external,
  icon: Icon,
  label,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  external?: boolean;
  icon: IconComponent;
  /** Accessible name — these buttons show only an icon. */
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const dimension = size === "sm" ? "h-10 w-10" : "h-11 w-11";
  const variantClass =
    variant === "secondary"
      ? "border border-(--color-border) text-(--color-text-primary) hover:border-(--color-primary) hover:text-(--color-primary)"
      : VARIANT_CLASSES[variant];
  const sharedClasses = `flex ${dimension} shrink-0 items-center justify-center rounded-full ${variantClass} ${className ?? ""}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={sharedClasses}>
        <Icon className="h-5 w-5" />
      </a>
    );
  }
  return (
    <a href={href} aria-label={label} className={sharedClasses}>
      <Icon className="h-5 w-5" />
    </a>
  );
}
