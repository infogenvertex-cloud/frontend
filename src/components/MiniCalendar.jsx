import { useState } from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MiniCalendar() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  // Always 42 cells (6 rows x 7) so height stays fixed
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="bg-white rounded-xl p-4 marvel-animate-in" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0d2137" }}>
          {MONTHS[month]} {year}
        </h4>
        <button onClick={next} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold uppercase text-gray-400 tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid — fixed 6 rows */}
      <div className="grid grid-cols-7">
        {cells.map((d, i) => (
          <div
            key={i}
            className={`text-center text-[11px] py-1 rounded transition-all duration-200 ${
              d === null
                ? ""
                : isToday(d)
                ? "text-white font-bold"
                : "text-gray-600 hover:bg-gray-100 cursor-default"
            }`}
            style={
              d && isToday(d)
                ? { background: "#1565c0" }
                : {}
            }
          >
            {d || ""}
          </div>
        ))}
      </div>

      {/* Today */}
      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#1565c0" }} />
          <p className="text-[10px] text-gray-500">
            {today.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
          </p>
        </div>
        <button
          onClick={() => setCurrent(new Date(today.getFullYear(), today.getMonth(), 1))}
          className="text-[10px] font-semibold px-2 py-0.5 rounded transition-all hover:bg-blue-50"
          style={{ color: "#1565c0" }}
        >
          Today
        </button>
      </div>
    </div>
  );
}
