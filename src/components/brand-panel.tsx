import Image from "next/image";
import type { ReactNode } from "react";

type BrandPanelProps = {
  icon: ReactNode;
  variant?: "hero" | "card";
  src?: string;
  alt?: string;
  className?: string;
};

/**
 * Placeholder brand visual used until real company photography is ready.
 * To swap in a real photo later: add a file at
 * /public/images/services/<slug>-afaq-alhayat-dubai.jpg and pass it as `src`
 * — the gradient placeholder is replaced automatically, no markup changes.
 */
export function BrandPanel({
  icon,
  variant = "card",
  src,
  alt = "",
  className = "",
}: BrandPanelProps) {
  const badgeSize = variant === "hero" ? "h-20 w-20 tablet:h-24 tablet:w-24" : "h-14 w-14";

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-(--color-primary) to-[#0a2f52] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />

      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="relative flex h-full items-center justify-center">
          <div
            className={`flex items-center justify-center rounded-full bg-white/10 text-(--color-surface) ${badgeSize}`}
          >
            {icon}
          </div>
        </div>
      )}
    </div>
  );
}
