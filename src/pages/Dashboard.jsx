import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import StatsCard from "../components/StatsCard";
import MiniCalendar from "../components/MiniCalendar";
import { CaptainShield, IronManHelmet, HulkFist, ThorHammer } from "../components/MarvelIcons";

const downloadIcons = [CaptainShield, IronManHelmet, HulkFist, ThorHammer];

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/dashboard/").then((r) => r.data),
  });

  if (isLoading || !data) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h2 className="marvel-title text-3xl mb-8" style={{ letterSpacing: "0.1em" }}>DASHBOARD</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          subtitle="SYSTEM STATUS: OPTIMISED"
        />
        <StatsCard
          title="EXPIRING SOON"
          value={data.expiring_soon}
          icon="hulk"
          theme="hulk"
          subtitle="IMMEDIATE ATTENTION REQUIRED"
        />
        <StatsCard
          title="RECENT PAYMENTS"
          value={`Rs. ${data.recent_payments.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}`}
          icon="thor"
          theme="thor"
          subtitle="POWER SURGE ONLINE"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Recent Payments Table */}
      <div className="lg:col-span-3 bg-white rounded-xl p-6 marvel-animate-in overflow-auto" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", maxHeight: "calc(100vh - 380px)" }}>
        <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ color: "#0d2137" }}>
          Recent Payments
        </h3>
        {data.recent_payments.length === 0 ? (
          <p className="text-gray-400">No payments yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200" style={{ background: "#f5f7fa" }}>
                <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Member ID</th>
                <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="pb-3 pt-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_payments.map((p, idx) => {
                const IconComponent = downloadIcons[idx % downloadIcons.length];
                return (
                  <tr key={p.id} className="border-b border-gray-100 marvel-row-hover transition-colors">
                    <td className="py-3 px-4 text-gray-600">{p.id}</td>
                    <td className="py-3 px-4 font-mono font-semibold" style={{ color: "#1565c0" }}>{p.member_code || p.member_id}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{p.member_name || "--"}</td>
                    <td className="py-3 px-4 text-gray-600">{p.member_phone || "--"}</td>
                    <td className="py-3 px-4 font-semibold" style={{ color: "#0d2137" }}>Rs. {p.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      {p.invoice_url ? (
                        <a
                          href={p.invoice_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Invoice
                        </a>
                      ) : (
                        <span className="text-gray-300 text-sm">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
