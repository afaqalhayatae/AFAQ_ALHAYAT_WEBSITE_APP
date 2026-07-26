/**
 * Shared line-icon set (24px medium, ~1.75px stroke) per the design system's
 * ICONS.md style rules. Lucide is the documented preference but is a new
 * dependency this job can't add, so these are hand-drawn to match its
 * proportions and visual language instead.
 */

import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
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

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 4h3l1.5 4.5L7.5 10a11 11 0 0 0 6.5 6.5l1.5-2L20 16v3a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </Icon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.25" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h16" />
      <path d="m13 5 7 7-7 7" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" />
    </Icon>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={1.25} fill="currentColor" stroke="none">
      <path d="M12 2.5c.5 3.6 2.3 5.9 6 6.5-3.7.6-5.5 2.9-6 6.5-.5-3.6-2.3-5.9-6-6.5 3.7-.6 5.5-2.9 6-6.5Z" />
      <path d="M18.5 15.5c.3 1.7 1.1 2.7 2.8 3-1.7.3-2.5 1.3-2.8 3-.3-1.7-1.1-2.7-2.8-3 1.7-.3 2.5-1.3 2.8-3Z" />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m8.5 12.3 2.3 2.3 4.7-4.7" />
    </Icon>
  );
}

export function MenuIcon({ open, ...props }: IconProps & { open: boolean }) {
  return (
    <Icon {...props}>
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
    </Icon>
  );
}

/* Service icons */

export function AcUnitIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="6" width="17" height="7" rx="1.5" />
      <path d="M7 16.5V19M12 16.5V19M17 16.5V19" />
    </Icon>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3s6 6.8 6 11a6 6 0 0 1-12 0c0-4.2 6-11 6-11Z" />
    </Icon>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 11 12 4.5 19.5 11" />
      <path d="M6.5 9.5V19a1 1 0 0 0 1 1H16.5a1 1 0 0 0 1-1V9.5" />
    </Icon>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="3.5" width="14" height="17" rx="1" />
      <path d="M8.5 7.5h1M14.5 7.5h1M8.5 11.5h1M14.5 11.5h1M8.5 15.5h1M14.5 15.5h1" />
      <path d="M10.5 20.5V17h3v3.5" />
    </Icon>
  );
}

export function SofaIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12V8.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M16 12V8.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M5 12h14a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1Z" />
      <path d="M5.5 16.5V19M18.5 16.5V19" />
    </Icon>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </Icon>
  );
}

/* Category + trust icons (JOB-AGT-WEB-20260726-M3.1) */

export function WrenchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.7 5.3a4 4 0 0 0-5.4 4.9L4 15.5V19h3.5l5.3-5.3a4 4 0 0 0 4.9-5.4l-2.1 2.1a1.8 1.8 0 0 1-2.5-2.5l2.1-2.1Z" />
    </Icon>
  );
}

export function CleaningIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 3.5h2v2.2l1.5 1V9h-5V6.7l1.5-1Z" />
      <path d="M8.5 9h5A1.5 1.5 0 0 1 15 10.5V19a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 8 19V10.5A1.5 1.5 0 0 1 8.5 9Z" />
      <path d="M16.5 7.5h2M17 10h2.2M16.5 12.5h2" />
    </Icon>
  );
}

export function ServiceRequestIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="6" y="4.5" width="12" height="16" rx="1.5" />
      <path d="M9.5 4.5V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v.5" />
      <path d="m9 13 2.2 2.2L15.5 11" />
    </Icon>
  );
}

export function BadgeCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2.8 13.8 4l2.3-.4.9 2.1 2.1.9-.4 2.3 1.2 1.8-1.2 1.8.4 2.3-2.1.9-.9 2.1-2.3-.4L12 21.2 10.2 20l-2.3.4-.9-2.1-2.1-.9.4-2.3L4.1 13l1.2-1.8-.4-2.3 2.1-.9.9-2.1 2.3.4Z" />
      <path d="m8.7 12.3 2.3 2.3 4.3-4.6" />
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
