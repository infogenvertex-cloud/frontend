// Captain America Shield Icon
export function CaptainShield({ size = 48 }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const outerR = s * 0.42;
  const ring2R = s * 0.33;
  const ring3R = s * 0.24;
  const innerR = s * 0.15;
  const starSize = s * 0.16;

  // Star points centered at (cx, cy)
  const starPoints = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    starPoints.push(`${cx + starSize * Math.cos(angle)},${cy + starSize * Math.sin(angle)}`);
    const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
    starPoints.push(`${cx + starSize * 0.4 * Math.cos(innerAngle)},${cy + starSize * 0.4 * Math.sin(innerAngle)}`);
  }

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={cx} cy={cy} r={outerR} fill="#1565c0" />
      <circle cx={cx} cy={cy} r={ring2R} fill="#c62828" />
      <circle cx={cx} cy={cy} r={ring3R} fill="#1565c0" />
      <circle cx={cx} cy={cy} r={innerR} fill="white" />
      <polygon points={starPoints.join(" ")} fill="#1565c0" />
    </svg>
  );
}

// Iron Man Helmet Icon
export function IronManHelmet({ size = 48 }) {
  const s = size;
  const scale = s / 48;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer helmet shape */}
      <path d="M24 4C17 4 12 10 10 16V34C10 40 16 44 24 44C32 44 38 40 38 34V16C36 10 31 4 24 4Z" fill="#c62828" />
      {/* Inner face plate */}
      <path d="M24 8C19 8 15 12 14 16V30C14 34 18 38 24 38C30 38 34 34 34 30V16C33 12 29 8 24 8Z" fill="#d32f2f" />
      {/* Gold faceplate */}
      <path d="M16 18L20 14H28L32 18V28L28 34H20L16 28V18Z" fill="#fbc02d" />
      {/* Eye slits */}
      <path d="M17 20L21 18H23L19 22L17 20Z" fill="white" opacity="0.9" />
      <path d="M31 20L27 18H25L29 22L31 20Z" fill="white" opacity="0.9" />
      {/* Mouth area */}
      <rect x="20" y="26" width="8" height="2" rx="1" fill="#c62828" opacity="0.6" />
      <rect x="20" y="29" width="8" height="1.5" rx="0.75" fill="#c62828" opacity="0.4" />
    </svg>
  );
}

// Hulk Fist Icon
export function HulkFist({ size = 48 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main fist */}
      <path d="M16 28V14C16 12 17 10 19 10C21 10 22 12 22 14V8C22 6 23 4 25 4C27 4 28 6 28 8V12C28 10 29 8 31 8C33 8 34 10 34 12V16C34 14 35 12 37 12C39 12 40 14 40 16V30C40 38 34 44 26 44H24C18 44 14 40 14 34V32" fill="#2e7d32" />
      {/* Thumb */}
      <path d="M14 32C12 32 10 30 10 28C10 26 12 24 14 24V28V32Z" fill="#2e7d32" opacity="0.85" />
      <path d="M16 28H14V24L16 22V28Z" fill="#2e7d32" opacity="0.9" />
      {/* Knuckle lines */}
      <path d="M19 14V10" stroke="#1b5e20" strokeWidth="0.8" opacity="0.4" />
      <path d="M25 8V4" stroke="#1b5e20" strokeWidth="0.8" opacity="0.4" />
      <path d="M31 12V8" stroke="#1b5e20" strokeWidth="0.8" opacity="0.4" />
      <path d="M37 16V12" stroke="#1b5e20" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// Thor Hammer (Mjolnir) Icon
export function ThorHammer({ size = 48 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <rect x="22" y="22" width="4" height="18" rx="1" fill="#795548" />
      {/* Handle grip */}
      <rect x="20" y="38" width="8" height="4" rx="1.5" fill="#5d4037" />
      {/* Hammer head */}
      <rect x="12" y="6" width="24" height="16" rx="3" fill="#616161" />
      {/* Hammer detail */}
      <rect x="14" y="8" width="20" height="12" rx="2" fill="#757575" opacity="0.6" />
      {/* Rune/detail on hammer */}
      <rect x="22" y="9" width="4" height="10" rx="1" fill="#9e9e9e" opacity="0.4" />
      {/* Lightning bolts */}
      <path d="M8 10L6 14L9 13L7 18" stroke="#1976d2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M40 10L42 14L39 13L41 18" stroke="#1976d2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M5 6L7 3" stroke="#1976d2" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M43 6L41 3" stroke="#1976d2" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// Small inline versions for buttons/nav (16x16)
export function CaptainShieldSmall() {
  return <CaptainShield size={16} />;
}

export function IronManHelmetSmall() {
  return <IronManHelmet size={16} />;
}

export function HulkFistSmall() {
  return <HulkFist size={16} />;
}

export function ThorHammerSmall() {
  return <ThorHammer size={16} />;
}

// Marvel M Shield Logo
export function MarvelMLogo({ size = 48 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield shape */}
      <path d="M24 2L44 12V28C44 38 34 46 24 46C14 46 4 38 4 28V12L24 2Z" fill="#0d2137" />
      <path d="M24 5L41 13.5V28C41 36.5 32.5 43 24 43C15.5 43 7 36.5 7 28V13.5L24 5Z" fill="#102a43" />
      {/* Inner border */}
      <path d="M24 7L39 14.5V28C39 35.5 31 41.5 24 41.5C17 41.5 9 35.5 9 28V14.5L24 7Z" fill="none" stroke="#1565c0" strokeWidth="1" opacity="0.5" />
      {/* Bold M */}
      <path d="M13 34V16L19 28L24 18L29 28L35 16V34H31V24L27 32H21L17 24V34H13Z" fill="white" />
      {/* Accent line */}
      <line x1="13" y1="36" x2="35" y2="36" stroke="#1565c0" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

// Icon map for easy access
export const marvelIcons = {
  captain: CaptainShield,
  ironman: IronManHelmet,
  hulk: HulkFist,
  thor: ThorHammer,
};

export const marvelIconsSmall = {
  captain: CaptainShieldSmall,
  ironman: IronManHelmetSmall,
  hulk: HulkFistSmall,
  thor: ThorHammerSmall,
};

// Generic SVG Icons for UI
export const MarvelIcons = {
  Users: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Plus: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
};
