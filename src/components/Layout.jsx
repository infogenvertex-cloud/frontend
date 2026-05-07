import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MarvelMLogo } from "./MarvelIcons";
import marvelBg from "../assets/marvel theme2.jpg";
import ironmanBg from "../assets/Iron Man.jpg";
import thorBg from "../assets/thor.jpg";
import drstrange from "../assets/spyderman.jpg";

const pageBgs = {
  "/": { img: marvelBg, rotate: "0deg" },
  "/members": { img: ironmanBg, rotate: "0deg" },
  "/visitors": { img: drstrange, rotate: "0deg" },
};

const navItems = [
  { path: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1", color: "#1565c0" },
  { path: "/members", label: "Members", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "#c62828" },
  { path: "/revenue", label: "Revenue", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#2e7d32" },
  { path: "/expiring", label: "Expiring Soon", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "#f57c00" },
  { path: "/visitors", label: "Visitors", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "#7b1fa2" },
];

export default function Layout({ children, onLogout }) {
  const location = useLocation();
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log("🏗️ Layout Component Mounted");
    console.log("  Admin data:", admin);
    console.log("  Current path:", location.pathname);
  }, []);

  useEffect(() => {
    console.log("🧭 Navigation:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex h-screen" style={{ background: "#f0f4f8" }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        style={{ border: "1px solid #e0e4e8" }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 marvel-sidebar flex flex-col fixed lg:relative h-full z-40 transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Logo Area */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="marvel-logo-pulse">
              <MarvelMLogo size={46} />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wide" style={{ color: "#0d2137" }}>
                MARVEL FITNESS
              </h1>
              <p className="text-[10px] font-bold tracking-[0.3em] mt-0.5" style={{ color: "#1565c0" }}>
                GYM MANAGEMENT
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4 mb-3">
            Navigation
          </p>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  active ? "nav-active" : ""
                }`}
                style={
                  active
                    ? {
                        background: `linear-gradient(135deg, ${item.color}15, ${item.color}08)`,
                        borderLeft: `3px solid ${item.color}`,
                        color: item.color,
                      }
                    : {}
                }
              >
                {/* Hover shine effect */}
                <span className="nav-shine" />

                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: active ? `${item.color}18` : "#f1f5f9",
                    border: active ? `1px solid ${item.color}30` : "1px solid #e2e8f0",
                  }}
                >
                  <svg
                    className="w-[18px] h-[18px] transition-all duration-300"
                    fill="none"
                    stroke={active ? item.color : "#94a3b8"}
                    viewBox="0 0 24 24"
                    strokeWidth={active ? 2.5 : 2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>

                <span className={`text-sm uppercase tracking-wider font-semibold transition-all duration-300 ${
                  active ? "" : "text-gray-500 group-hover:text-gray-800"
                }`}>
                  {item.label}
                </span>

                {active && (
                  <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: item.color }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Info */}
        <div className="px-4 py-4 border-t border-gray-100 mx-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #1565c0, #0d47a1)" }}
            >
              {(admin.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: "#0d2137" }}>
                {admin.name || "Marvel Fitness"}
              </p>
              <p className="text-xs text-gray-400 truncate">{admin.email || ""}</p>
            </div>
            <button
              onClick={onLogout}
              className="logout-btn p-2.5 rounded-xl transition-all duration-300"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 tech-bg relative" style={{
        "--marvel-bg": `url(${(pageBgs[location.pathname] || pageBgs["/"+location.pathname.split("/")[1]] || pageBgs["/"]).img})`,
        "--marvel-rotate": (pageBgs[location.pathname] || pageBgs["/"+location.pathname.split("/")[1]] || pageBgs["/"]).rotate,
      }}>
        {children}
      </main>
    </div>
  );
}
