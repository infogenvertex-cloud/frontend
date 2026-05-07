import captainImg from "../assets/captain america.jpg";
import ironmanImg from "../assets/Iron Man.jpg";
import hulkImg from "../assets/Hulk.jpg";
import thorImg from "../assets/thor.jpg";
import spydermanImg from "../assets/spyderman.jpg";

const cardImages = {
  captain: captainImg,
  ironman: ironmanImg,
  hulk: hulkImg,
  thor: thorImg,
  spyderman: spydermanImg,
};

const cardColors = {
  captain: {
    overlay: "linear-gradient(135deg, rgba(13,33,55,0.75), rgba(21,101,192,0.5))",
    border: "#1565c0",
    glow: "rgba(21,101,192,0.25)",
    accent: "#64b5f6",
  },
  ironman: {
    overlay: "linear-gradient(135deg, rgba(120,50,0,0.75), rgba(198,40,40,0.5))",
    border: "#fbc02d",
    glow: "rgba(251,192,45,0.25)",
    accent: "#fdd835",
  },
  hulk: {
    overlay: "linear-gradient(135deg, rgba(10,40,20,0.75), rgba(46,125,50,0.5))",
    border: "#2e7d32",
    glow: "rgba(46,125,50,0.25)",
    accent: "#66bb6a",
  },
  thor: {
    overlay: "linear-gradient(135deg, rgba(13,33,55,0.75), rgba(25,118,210,0.5))",
    border: "#1976d2",
    glow: "rgba(25,118,210,0.25)",
    accent: "#42a5f5",
  },
  spyderman: {
    overlay: "linear-gradient(135deg, rgba(120,20,20,0.75), rgba(198,40,40,0.5))",
    border: "#d32f2f",
    glow: "rgba(211,47,47,0.25)",
    accent: "#ef5350",
  },
};

export default function StatsCard({ title, value, icon, subtitle, theme }) {
  const themeKey = theme || icon || "captain";
  const bgImage = cardImages[themeKey];
  const colors = cardColors[themeKey] || cardColors.captain;

  return (
    <div
      className="stats-card rounded-2xl overflow-hidden marvel-animate-in relative group"
      style={{
        height: "220px",
        border: `2px solid ${colors.border}`,
        boxShadow: `0 8px 24px ${colors.glow}, 0 2px 8px rgba(0,0,0,0.1)`,
      }}
    >
      {/* Background image with zoom on hover */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          ...(themeKey === "hulk" ? { transform: "scaleX(-1)" } : {}),
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: colors.overlay }}
      />

      {/* Bottom fade for text */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
      />

      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${colors.border}, ${colors.accent}, ${colors.border})` }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5">
        {/* Title with accent line */}
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-sm">
            {title}
          </p>
          <div className="w-8 h-0.5 mt-2 rounded-full" style={{ background: colors.accent }} />
        </div>

        {/* Large value */}
        <p className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">
          {value}
        </p>

        {/* Subtitle with icon */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.accent }} />
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-semibold text-white/60">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Hover shine sweep */}
      <div className="card-shine" />
    </div>
  );
}
