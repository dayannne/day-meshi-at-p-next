import { DEFAULT_CENTER_MARKER_VARIANT } from "./constants";
import type { GoogleMapMarkerVariant } from "./types";

type GoogleMapMarkerIconProps = {
  selected: boolean;
  variant?: GoogleMapMarkerVariant;
};

const MARKER_ICON_CLASS_NAME = "h-[52px] w-[52px] drop-shadow-md";

export function GoogleMapMarkerIcon({ selected, variant }: GoogleMapMarkerIconProps) {
  if (selected) {
    return <SelectedMarkerIcon />;
  }

  switch (variant ?? DEFAULT_CENTER_MARKER_VARIANT) {
    case "gochimeshi":
      return <GochimeshiMarkerIcon />;
    case "non-gochimeshi":
      return <NonGochimeshiMarkerIcon />;
    case "default-center":
      return <DefaultCenterMarkerIcon />;
  }
}

function DefaultCenterMarkerIcon() {
  return (
    <svg
      aria-hidden="true"
      className={MARKER_ICON_CLASS_NAME}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 4C17.716 4 11 10.716 11 19C11 29.5 23 42 26 45C29 42 41 29.5 41 19C41 10.716 34.284 4 26 4Z"
        fill="#2563EB"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="19" y="15" width="14" height="14" rx="2" fill="#FFFFFF" />
      <path d="M17 17.5L26 10L35 17.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <rect x="24" y="22" width="4" height="7" rx="1" fill="#2563EB" />
      <circle cx="38" cy="8" r="5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
    </svg>
  );
}

function GochimeshiMarkerIcon() {
  return (
    <svg
      aria-hidden="true"
      className={MARKER_ICON_CLASS_NAME}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 4C17.716 4 11 10.716 11 19C11 29.5 23 42 26 45C29 42 41 29.5 41 19C41 10.716 34.284 4 26 4Z"
        fill="#16A34A"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="19" r="11" fill="#DCFCE7" />
      <path
        d="M20.5 19.5L24.5 23.5L32 15.5"
        stroke="#16A34A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="26" y="38" fill="#FFFFFF" fontSize="8" fontWeight="800" textAnchor="middle">
        OK
      </text>
      <circle cx="38" cy="8" r="5" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" />
    </svg>
  );
}

function NonGochimeshiMarkerIcon() {
  return (
    <svg
      aria-hidden="true"
      className={MARKER_ICON_CLASS_NAME}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 4C17.716 4 11 10.716 11 19C11 29.5 23 42 26 45C29 42 41 29.5 41 19C41 10.716 34.284 4 26 4Z"
        fill="#DC2626"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="19" r="11" fill="#FEE2E2" />
      <path
        d="M21.5 14.5L30.5 23.5M30.5 14.5L21.5 23.5"
        stroke="#DC2626"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="26" y="38" fill="#FFFFFF" fontSize="8" fontWeight="800" textAnchor="middle">
        NG
      </text>
      <circle cx="38" cy="8" r="5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
    </svg>
  );
}

function SelectedMarkerIcon() {
  return (
    <svg
      aria-hidden="true"
      className={MARKER_ICON_CLASS_NAME}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 4C17.716 4 11 10.716 11 19C11 29.5 23 42 26 45C29 42 41 29.5 41 19C41 10.716 34.284 4 26 4Z"
        fill="#111827"
        stroke="#FACC15"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="19" r="12" fill="#FACC15" />
      <circle cx="26" cy="19" r="6" fill="#111827" />
      <text x="26" y="39" fill="#FFFFFF" fontSize="7" fontWeight="800" textAnchor="middle">
        SEL
      </text>
      <circle cx="38" cy="8" r="5" fill="#FACC15" stroke="#111827" strokeWidth="2" />
    </svg>
  );
}
