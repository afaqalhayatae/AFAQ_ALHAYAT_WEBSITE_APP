/**
 * Editorial line-art scenes standing in for real company photography
 * (JOB-AGT-WEB-20260726-M3.1). Deliberately architectural/object-based
 * rather than figurative — no people, no insects — per the Luxury Design
 * Direction's ban on "visibly artificial people" and pest-fear imagery.
 * Each scene fills its BrandPanel via `preserveAspectRatio="...slice"` and
 * uses only white-on-brand-blue strokes so it stays a single restrained
 * color family at any category tint.
 */

type SceneProps = { "data-testid"?: string };

const sceneProps = {
  "aria-hidden": true,
  className: "pointer-events-none absolute inset-0 h-full w-full",
  preserveAspectRatio: "xMidYMid slice",
  viewBox: "0 0 400 300",
  fill: "none",
} as const;

export function HeroScene(props: SceneProps) {
  return (
    <svg {...sceneProps} {...props}>
      {/* ground */}
      <line x1="0" y1="252" x2="400" y2="252" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" />
      {/* reflecting pool */}
      <rect
        x="40"
        y="256"
        width="120"
        height="26"
        rx="4"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        fill="white"
        fillOpacity="0.04"
      />
      <path d="M52 268h96M52 274h96" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
      {/* palm accent */}
      <path d="M70 252V190" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M70 194c-14-10-24-8-32-2M70 190c-16-6-26 0-34 8M70 186c10-14 22-16 32-12M70 182c8-16 20-20 30-18M70 196c6-14 16-20 26-20"
        stroke="white"
        strokeOpacity="0.28"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* villa body */}
      <rect
        x="150"
        y="140"
        width="200"
        height="112"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1.75"
        fill="white"
        fillOpacity="0.03"
      />
      <path d="M138 140h224" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M230 252v-46a20 20 0 0 1 40 0v46"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1.75"
        fill="none"
      />
      <rect x="172" y="168" width="36" height="46" rx="1.5" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
      <path d="M190 168v46" stroke="white" strokeOpacity="0.25" strokeWidth="1.2" />
      <rect x="292" y="168" width="36" height="46" rx="1.5" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
      <path d="M310 168v46" stroke="white" strokeOpacity="0.25" strokeWidth="1.2" />
    </svg>
  );
}

export function MaintenanceScene(props: SceneProps) {
  return (
    <svg {...sceneProps} {...props}>
      {/* wall-mounted AC unit */}
      <rect
        x="130"
        y="70"
        width="140"
        height="48"
        rx="8"
        stroke="white"
        strokeOpacity="0.32"
        strokeWidth="1.75"
        fill="white"
        fillOpacity="0.03"
      />
      <path d="M148 94h104M148 102h104" stroke="white" strokeOpacity="0.22" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="252" cy="86" r="3" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
      <path
        d="M170 122c6 8 6 16 0 24M200 122c6 10 6 20 0 30M230 122c6 8 6 16 0 24"
        stroke="white"
        strokeOpacity="0.16"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* organized tool tray */}
      <rect x="90" y="200" width="220" height="16" rx="4" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
      <path
        d="M130 176a12 12 0 0 0-16 15l-24 24v10h10l24-24a12 12 0 0 0 15-16l-6 6a5 5 0 0 1-7-7l6-6Z"
        stroke="white"
        strokeOpacity="0.34"
        strokeWidth="1.6"
        fill="none"
      />
      <path
        d="M210 168v40M204 168h12l-6-14Z"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="270" cy="190" r="18" stroke="white" strokeOpacity="0.3" strokeWidth="1.6" />
      <path d="M270 190 280 178" stroke="white" strokeOpacity="0.34" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M258 190h4M270 178v4M282 190h-4M270 202v-4"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      {/* inspection checklist */}
      <rect x="60" y="150" width="30" height="40" rx="2" stroke="white" strokeOpacity="0.24" strokeWidth="1.4" />
      <path d="M66 160h18M66 168h18M66 176h12" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      <path
        d="m67 183 3 3 6-7"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function CleaningScene(props: SceneProps) {
  return (
    <svg {...sceneProps} {...props}>
      {/* window with light rays */}
      <rect
        x="230"
        y="50"
        width="110"
        height="130"
        rx="3"
        stroke="white"
        strokeOpacity="0.34"
        strokeWidth="1.75"
        fill="white"
        fillOpacity="0.03"
      />
      <path d="M285 50v130M230 115h110" stroke="white" strokeOpacity="0.26" strokeWidth="1.3" />
      <path
        d="M230 90 130 150M230 120 110 190M230 150 140 230"
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* polished floor */}
      <line x1="0" y1="252" x2="400" y2="252" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
      <path d="M60 252c40 6 80 6 120 0" stroke="white" strokeOpacity="0.12" strokeWidth="1" fill="none" />
      {/* cleaning caddy */}
      <rect x="60" y="196" width="60" height="40" rx="6" stroke="white" strokeOpacity="0.3" strokeWidth="1.6" />
      <path
        d="M70 196v-10a20 20 0 0 1 40 0v10"
        stroke="white"
        strokeOpacity="0.28"
        strokeWidth="1.6"
        fill="none"
      />
      {/* spray bottle */}
      <path
        d="M150 226v-46h10l6-8h10v8h4v46Z"
        stroke="white"
        strokeOpacity="0.32"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M176 178 188 168" stroke="white" strokeOpacity="0.22" strokeWidth="1.3" strokeLinecap="round" />
      {/* folded cloth */}
      <path
        d="M70 236h40a6 6 0 0 0 6-6v-6H64v6a6 6 0 0 0 6 6Z"
        stroke="white"
        strokeOpacity="0.26"
        strokeWidth="1.4"
        fill="none"
      />
      {/* sparkle accents */}
      <path
        d="M200 190l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M320 210l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function PestControlScene(props: SceneProps) {
  return (
    <svg {...sceneProps} {...props}>
      {/* protective dome arcs */}
      <path
        d="M90 220a110 110 0 0 1 220 0"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="2"
        strokeDasharray="2 10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M70 226a130 130 0 0 1 260 0"
        stroke="white"
        strokeOpacity="0.14"
        strokeWidth="1.5"
        strokeDasharray="1 12"
        strokeLinecap="round"
        fill="none"
      />
      {/* protected home */}
      <path
        d="M150 226v-46l50-30 50 30v46Z"
        stroke="white"
        strokeOpacity="0.32"
        strokeWidth="1.75"
        fill="white"
        fillOpacity="0.03"
      />
      <rect x="188" y="196" width="24" height="30" stroke="white" strokeOpacity="0.28" strokeWidth="1.5" />
      <rect x="164" y="188" width="18" height="18" stroke="white" strokeOpacity="0.24" strokeWidth="1.3" />
      <rect x="218" y="188" width="18" height="18" stroke="white" strokeOpacity="0.24" strokeWidth="1.3" />
      <line x1="0" y1="226" x2="400" y2="226" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" />
      {/* verified shield */}
      <path
        d="M300 150 320 158v18c0 14-9 23-20 27-11-4-20-13-20-27v-18Z"
        stroke="white"
        strokeOpacity="0.34"
        strokeWidth="1.6"
        fill="none"
      />
      <path
        d="m292 176 6 6 12-13"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* inspection clipboard */}
      <rect x="70" y="140" width="32" height="42" rx="2" stroke="white" strokeOpacity="0.22" strokeWidth="1.3" />
      <path d="M76 150h20M76 158h20M76 166h14" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
    </svg>
  );
}
