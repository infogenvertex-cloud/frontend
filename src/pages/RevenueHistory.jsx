import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export default function RevenueHistory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["revenue-history"],
    queryFn: () => api.get("/revenue/history").then((r) => r.data),
  });

  const monthlyData = data?.monthly_data || [];
  const totalAllTime = data?.total_all_time || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading revenue history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error loading revenue history: {error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="marvel-title text-xl sm:text-2xl">Revenue History</h2>
          <p className="text-gray-500 text-sm mt-1">Monthly revenue breakdown</p>
        </div>
        <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Total All-Time Revenue
          </div>
          <div className="text-2xl font-bold" style={{ color: "#2e7d32" }}>
            Rs. {totalAllTime.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {monthlyData.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center marvel-animate-in" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-400 text-lg">No revenue data yet</p>
          <p className="text-gray-400 text-sm mt-2">Revenue will appear here once payments are recorded</p>
        </div>
      ) : (
        <>
          {/* Revenue Table */}
          <div className="bg-white rounded-xl overflow-hidden mb-6 marvel-animate-in overflow-x-auto" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
            <div className="min-w-[700px]">
              <table className="w-full text-left">
                <thead style={{ background: "#f5f7fa" }}>
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total Revenue</th>
                    <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Payments</th>
                    <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Avg per Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((item, index) => (
                    <tr 
                      key={`${item.year}-${item.month}`} 
                      className="border-t border-gray-100 marvel-row-hover transition-colors"
                      style={index === 0 ? { background: "rgba(46, 125, 50, 0.02)" } : {}}
                    >
                      <td className="px-4 sm:px-6 py-4 text-gray-700 font-medium text-sm">
                        <div className="flex items-center gap-2">
                          {item.month_name}
                          {index === 0 && (
                            <span 
                              className="text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ background: "rgba(46, 125, 50, 0.1)", color: "#2e7d32" }}
                            >
                              Latest
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{item.year}</td>
                      <td className="px-4 sm:px-6 py-4 font-bold text-sm text-right" style={{ color: "#2e7d32" }}>
                        Rs. {item.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#e3f2fd", color: "#1565c0" }}>
                          {item.payment_count}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-700 font-semibold text-sm text-right">
                        Rs. {(item.total_revenue / item.payment_count).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot style={{ background: "#f5f7fa", borderTop: "2px solid #e0e4e8" }}>
                  <tr>
                    <td colSpan={2} className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Total
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-base text-right" style={{ color: "#2e7d32" }}>
                      Rs. {totalAllTime.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#e3f2fd", color: "#1565c0" }}>
                        {monthlyData.reduce((sum, item) => sum + item.payment_count, 0)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-700 font-semibold text-sm text-right">
                      Rs. {(totalAllTime / monthlyData.reduce((sum, item) => sum + item.payment_count, 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Total Months
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {monthlyData.length}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Total Payments
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {monthlyData.reduce((sum, item) => sum + item.payment_count, 0)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Average Monthly
                </div>
                <div className="text-xl font-bold text-gray-800">
                  Rs. {(totalAllTime / monthlyData.length).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
