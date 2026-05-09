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
        <div className="px-4 py-4 border-t border-gray-100 mx-2">
          {/* Social Media Links */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
              Connect With Us
            </p>
            <div className="flex items-center gap-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/marvel__fitnessgym?igsh=MWNtdGZyNDQwNjk2Zw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://chat.whatsapp.com/EC48HRVyDRCCplezvqH1Kg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: "#25D366" }}
                title="Join our WhatsApp group"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              {/* Google Maps - Using correct link */}
              <a
                href="https://maps.app.goo.gl/GiowmM1adxDW3umr6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: "#4285F4" }}
                title="Find us on Google Maps"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </a>
            </div>
          </div>

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
