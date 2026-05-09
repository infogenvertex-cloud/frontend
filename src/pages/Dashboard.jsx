import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../api/axios";
import StatsCard from "../components/StatsCard";
import MiniCalendar from "../components/MiniCalendar";
import { CaptainShield, IronManHelmet, HulkFist, ThorHammer } from "../components/MarvelIcons";

const downloadIcons = [CaptainShield, IronManHelmet, HulkFist, ThorHammer];

export default function Dashboard() {
  useEffect(() => {
    console.log("📊 Dashboard Component Mounted");
  }, []);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      console.log("🔄 Fetching dashboard data...");
      try {
        const response = await api.get("/dashboard/");
        console.log("✅ Dashboard data received:", response.data);
        return response.data;
      } catch (err) {
        console.error("❌ Dashboard fetch failed:", err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    console.log("📊 Dashboard State:", { isLoading, isError, hasData: !!data });
  }, [isLoading, isError, data]);

  if (isLoading) {
    console.log("⏳ Dashboard is loading...");
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("❌ Dashboard error:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold mb-2">Error loading dashboard</p>
          <p className="text-sm">{error?.message || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    console.warn("⚠️ Dashboard has no data");
    return <p className="text-gray-400">No data available</p>;
  }

  return (
    <div>
      <h2 className="marvel-title text-2xl sm:text-3xl mb-6 sm:mb-8" style={{ letterSpacing: "0.1em" }}>DASHBOARD</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="TOTAL MEMBERS"
          value={data.total_members}
          icon="captain"
          theme="captain"
          subtitle="STRENGTH IN NUMBERS"
        />
        <StatsCard
          title="ACTIVE MEMBERS"
          value={data.active_members}
          icon="ironman"
          theme="ironman"
          subtitle="CURRENT SUBSCRIPTIONS"
        />
        <StatsCard
          title="RECENT VISITORS"
          value={data.recent_visitors_count}
          icon="spyderman"
          theme="spyderman"
          subtitle="LAST 7 DAYS"
        />
        <StatsCard
          title="MONTHLY REVENUE"
          value={`Rs. ${data.monthly_revenue.toFixed(0)}`}
          icon="hulk"
          theme="hulk"
          subtitle={`${new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
      {/* Recent Payments Table */}
      <div className="lg:col-span-3 bg-white rounded-xl p-4 sm:p-6 marvel-animate-in overflow-x-auto" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", maxHeight: "calc(100vh - 380px)" }}>
        <h3 className="text-base sm:text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: "#0d2137" }}>
          Recent Payments
        </h3>
        {data.recent_payments.length === 0 ? (
          <p className="text-gray-400">No payments yet.</p>
        ) : (
          <div className="min-w-[600px]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200" style={{ background: "#f5f7fa" }}>
                  <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_payments.map((p, idx) => {
                  const IconComponent = downloadIcons[idx % downloadIcons.length];
                  return (
                    <tr key={p.id} className="border-b border-gray-100 marvel-row-hover transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-700">{p.member_name || "--"}</div>
                        <div className="text-xs font-mono" style={{ color: "#1565c0" }}>{p.member_code || `#${p.member_id}`}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{p.member_phone || "--"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: "#e3f2fd", color: "#1565c0" }}>
                          {(() => {
                            // Extract number and unit from plan (e.g., "45_month" or "30_day")
                            const parts = p.plan.split("_");
                            const number = parts[0];
                            const unit = parts[1];
                            
                            // Convert to days if it's in month format
                            if (unit === "month") {
                              const days = parseInt(number) * 30;
                              return `${days} DAYS`;
                            } else {
                              return `${number} ${unit.toUpperCase()}${parseInt(number) !== 1 ? 'S' : ''}`;
                            }
                          })()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold" style={{ color: "#0d2137" }}>Rs. {p.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(p.payment_date).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="lg:col-span-1 lg:sticky lg:top-0">
        <MiniCalendar />
      </div>
      </div>
    </div>
  );
}
