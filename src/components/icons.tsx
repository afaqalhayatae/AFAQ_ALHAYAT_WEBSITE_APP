/**
 * Centralized icon set for the entire site (2026-08-07 redesign,
 * Owner-requested: "modern, premium icons everywhere, expressive of
 * where they're placed"). Lucide is already a real dependency
 * (`package.json`) — the original hand-drawn generic set here predates
 * that (written when it wasn't), so every generic/UI icon below now
 * wraps a real Lucide glyph at one shared, slightly fine stroke weight
 * for a refined look, instead of a mix of hand-drawn paths and whatever
 * default weight happened to be used at each call site.
 *
 * Every exported name and prop signature is unchanged from before, so no
 * call site elsewhere in the app needed to change — this file is the one
 * place that decides what each icon actually looks like.
 *
 * Brand logos (WhatsApp, the social platforms, Google) and the UAE
 * regional silhouettes stay hand-drawn: no icon library ships accurate
 * brand marks, and Lucide has no "Dubai skyline" or "mosque dome" glyphs
 * to draw from.
 *
 * Every other icon on the site (header nav, theme toggle, chat widget)
 * now also imports from here rather than "lucide-react" directly, so the
 * stroke weight stays consistent site-wide — see the re-exports at the
 * bottom.
 */

import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Bug,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplet,
  Grid3x3,
  Hammer,
  Home,
  Layers,
  Lightbulb,
  Mail,
  MapPin,
  Menu as MenuGlyph,
  MessageCircle,
  Moon,
  Paperclip,
  Palette,
  PaintRoller,
  Phone,
  RotateCcw,
  Send,
  ShieldCheck,
  Snowflake,
  Sofa,
  Sparkles,
  SprayCan,
  Star,
  Sun,
  Thermometer,
  Umbrella,
  User,
  UtensilsCrossed,
  Waves,
  Wallpaper as WallpaperGlyph,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";

type IconProps = SVGProps<SVGSVGElement>;
type LucideComponent = ComponentType<IconProps>;

/** A touch finer than Lucide's default (2) — reads as more refined at the
 *  small sizes icons render at across this site. */
const STROKE_WIDTH = 1.75;

function wrap(Glyph: LucideComponent, extra?: IconProps) {
  return function WrappedIcon(props: IconProps) {
    return <Glyph strokeWidth={STROKE_WIDTH} {...extra} {...props} />;
  };
}

/* ---------------------------------------------------------------------
 * Generic UI / trust / category icons — Lucide-backed.
 * ------------------------------------------------------------------- */

export const PhoneIcon = wrap(Phone);
export const MailIcon = wrap(Mail);
export const MapPinIcon = wrap(MapPin);
export const UserIcon = wrap(User);
export const ArrowRightIcon = wrap(ArrowRight);
export const ClockIcon = wrap(Clock);
/** Filled sparkle accent (unlike most icons here, filled not outlined). */
export const SparkleIcon = wrap(Sparkles, { fill: "currentColor", strokeWidth: 1 });
/** Filled rating star (reviews) — renders as a real glyph, not a "★" character. */
export const StarIcon = wrap(Star, { fill: "currentColor" });
export const CheckCircleIcon = wrap(CheckCircle2);
export const AcUnitIcon = wrap(Snowflake);
export const DropletIcon = wrap(Droplet);
export const HomeIcon = wrap(Home);
export const BuildingIcon = wrap(Building2);
export const SofaIcon = wrap(Sofa);
export const ShieldCheckIcon = wrap(ShieldCheck);
export const WrenchIcon = wrap(Wrench);
/** Cleaning-service icon — a spray bottle reads more specifically as
 *  "cleaning" than a generic sparkle would. */
export const CleaningIcon = wrap(SprayCan);
export const ServiceRequestIcon = wrap(BadgeCheck);
export const BadgeCheckIcon = wrap(BadgeCheck);
/** Pest-control section icon — a real bug glyph, per `ICONS.md`'s own
 *  worked example ("أيقونة حشرة"), not a generic shield. */
export const PestIcon = wrap(Bug);

/** Matches the old `MenuIcon`'s `open` toggle API — swaps to an X when open. */
export function MenuIcon({ open, ...props }: IconProps & { open: boolean }) {
  const Glyph = open ? X : MenuGlyph;
  return <Glyph strokeWidth={STROKE_WIDTH} {...props} />;
}

/* ---------------------------------------------------------------------
 * Extra Lucide-backed icons for the wider service catalog
 * (service-visuals.tsx) — more specific per-service glyphs than the
 * original 6-icon set allowed.
 * ------------------------------------------------------------------- */

export const ElectricalIcon = wrap(Zap);
export const PaintingIcon = wrap(PaintRoller);
export const HandymanIcon = wrap(Hammer);
export const CameraIcon = wrap(Camera);
export const SmartHomeIcon = wrap(Wifi);
export const PoolIcon = wrap(Waves);
export const KitchenIcon = wrap(UtensilsCrossed);
export const DecorationIcon = wrap(Palette);
export const InterlockIcon = wrap(Grid3x3);
export const LightingIcon = wrap(Lightbulb);
export const WoodAlternativeIcon = wrap(Layers);
export const WallpaperInstallIcon = wrap(WallpaperGlyph);
export const ThermalInsulationIcon = wrap(Thermometer);
export const RooftopIcon = wrap(Sun);
export const WaterproofingIcon = wrap(Umbrella);

/* ---------------------------------------------------------------------
 * Re-exports for the three call sites that previously imported straight
 * from "lucide-react" (header, theme toggle, chat widget) — routed
 * through here now so the whole site shares one stroke weight.
 * ------------------------------------------------------------------- */

export const ChevronDownIcon = wrap(ChevronDown);
export const MenuGlyphIcon = wrap(MenuGlyph);
export const CloseIcon = wrap(X);
export const MoonIcon = wrap(Moon);
export const SunIcon = wrap(Sun);
export const BotIcon = wrap(Bot);
export const MessageCircleIcon = wrap(MessageCircle);
export const PaperclipIcon = wrap(Paperclip);
export const RotateCcwIcon = wrap(RotateCcw);
export const SendIcon = wrap(Send);

/* ---------------------------------------------------------------------
 * Hand-drawn brand marks and regional motifs — unchanged. No icon
 * library ships accurate brand logos or UAE-specific silhouettes.
 * ------------------------------------------------------------------- */

function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 17.5 4 20l2.6-.7A8 8 0 1 0 4.5 12 7.9 7.9 0 0 0 6.5 17.5Z" />
      <path d="M9 9.8c0 3.4 2.8 6.2 6.2 6.2.6 0 .9-.4.9-1v-1.1c0-.3-.2-.5-.4-.6l-1.7-.6c-.3-.1-.5 0-.7.2l-.4.5c-1-.5-1.8-1.3-2.3-2.3l.5-.4c.2-.2.3-.4.2-.7l-.6-1.7c-.1-.2-.3-.4-.6-.4H9.5c-.6 0-.5.5-.5.9Z" />
    </Icon>
  );
}

/* Emirate icons (Complete Visual Asset Generation Phase) — generic,
   place-appropriate silhouettes, deliberately not a specific trademarked
   building or monument. One per emirate, in ALL_EMIRATES registry order. */

export function MosqueDomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.2v1.6" />
      <circle cx="12" cy="3.4" r="0.6" fill="currentColor" stroke="none" />
      <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M4.5 20V13.5a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5V20" />
      <path d="M4.5 20h15M9.5 20v-3a2.5 2.5 0 0 1 5 0v3" />
    </Icon>
  );
}

export function SkylineIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20V9.5l3-1.5 3 1.5V20" />
      <path d="M10 20V5.5l3.5-2 3.5 2V20" />
      <path d="M17 20v-7l3-1.2V20" />
      <path d="M4 20h16" />
    </Icon>
  );
}

export function HeritageArchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 20V11a7 7 0 0 1 14 0v9" />
      <path d="M8.5 20v-6.5a3.5 3.5 0 0 1 7 0V20" />
      <path d="M4 20h16" />
    </Icon>
  );
}

export function AnchorIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="5.5" r="1.6" />
      <path d="M12 7.1V19M8 12H5.5a6.5 6.5 0 0 0 6.5 7 6.5 6.5 0 0 0 6.5-7H16" />
      <path d="M9 9.5h6" />
    </Icon>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 19c-1-6 2-13 14-14 1 12-6 15-14 14Z" />
      <path d="M5.5 18.5 15 9" />
    </Icon>
  );
}

export function MountainIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 19 9 8.5 12.5 14 15 10.5 20.5 19Z" />
      <path d="M9 8.5 10.3 11" />
    </Icon>
  );
}

export function CoastMountainIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 15.5 8 8l3 4.5 2.5-3 5 6" />
      <path d="M3 19c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" />
    </Icon>
  );
}

/* Social glyphs — simplified outline marks, one coherent stroke style */

export function FacebookIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.5 21v-7h2.3l.4-3H14.5V9c0-.9.2-1.5 1.6-1.5H17V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.8V11H8.5v3H11v7Z" />
    </Icon>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3.5v11.3a3.2 3.2 0 1 1-3.2-3.2c.3 0 .6 0 .9.1" />
      <path d="M14 3.5c.3 2 1.8 3.5 3.8 3.8" />
    </Icon>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10.5V17M8 7.6v.1" />
      <path d="M12 17v-3.7c0-1.4 1-2.1 2-2.1s1.8.6 1.8 2.1V17" />
    </Icon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </Icon>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 18c.6-2 1.4-5 1.4-5m0 0c-.4-.6-.6-1.4-.2-2.4.7-1.8 3.2-1.6 3.4.3.1 1.1-.7 2.9-1 3.6-.3.8.4 1.6 1.3 1.6 1.6 0 2.8-1.7 2.8-4.1 0-2.1-1.6-3.7-3.9-3.7-2.7 0-4.3 2-4.3 4 0 .8.3 1.6.7 2" />
    </Icon>
  );
}

export function ThreadsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.5c-4.5 0-6.5 3-6.5 8.5s2 8.5 6.5 8.5c3.6 0 5.6-2 5.9-4.6.3-2.6-1.2-4-3.4-4.3-2-.3-3.4.3-3.4 1.7 0 1 .9 1.6 2.1 1.4" />
    </Icon>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="3.5" />
      <path d="M10.5 9.7v4.6l4-2.3Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Google's official four-color "G" mark — a real brand logo (like WhatsAppIcon above), not a line icon, so it uses fill, not the shared Icon() stroke wrapper. */
export function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.89c2.28-2.1 3.56-5.2 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.89-3c-1.08.73-2.46 1.16-4.06 1.16-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.31A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.58.38-2.31v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.47 3.77 1.28 5.41l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.59l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}
