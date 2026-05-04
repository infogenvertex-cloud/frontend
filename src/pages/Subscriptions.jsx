import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export default function Subscriptions() {
  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ["allSubscriptions"],
    queryFn: () => api.get("/subscriptions/").then((r) => r.data),
  });

  if (isLoading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h2 className="marvel-title text-2xl mb-6">Subscriptions & Payments</h2>
      <div className="bg-white rounded-xl overflow-hidden marvel-animate-in" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
        <table className="w-full text-left">
          <thead style={{ background: "#f5f7fa" }}>
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Member ID</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Start</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">End</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Date</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id} className="border-t border-gray-100 marvel-row-hover transition-colors">
                <td className="px-6 py-4 text-gray-600">{s.id}</td>
                <td className="px-6 py-4 font-mono font-semibold" style={{ color: "#1565c0" }}>{s.member_code || s.member_id}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{s.member_name || "--"}</td>
                <td className="px-6 py-4 text-gray-600">{s.member_phone || "--"}</td>
                <td className="px-6 py-4 text-gray-700">{s.plan.replace("_", " ")}</td>
                <td className="px-6 py-4 text-gray-600">{s.start_date}</td>
                <td className="px-6 py-4 text-gray-600">{s.end_date}</td>
                <td className="px-6 py-4 font-semibold" style={{ color: "#0d2137" }}>Rs. {s.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(s.payment_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                    style={
                      s.status === "active"
                        ? { background: "rgba(46, 125, 50, 0.08)", color: "#2e7d32", border: "1px solid rgba(46, 125, 50, 0.2)" }
                        : { background: "rgba(198, 40, 40, 0.06)", color: "#c62828", border: "1px solid rgba(198, 40, 40, 0.15)" }
                    }
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {s.invoice_url ? (
                    <a
                      href={s.invoice_url}
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
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-8 text-center text-gray-400">
                  No subscriptions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
