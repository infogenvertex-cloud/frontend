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
          <div className="text-2xl font-bold" style={{ color: "#1565c0" }}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {monthlyData.map((item, index) => (
            <div
              key={`${item.year}-${item.month}`}
              className="bg-white rounded-xl p-6 marvel-animate-in hover:shadow-lg transition-all duration-200"
              style={{ 
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)", 
                border: "1px solid #e0e4e8",
                borderLeft: index === 0 ? "4px solid #1565c0" : "1px solid #e0e4e8",
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Month Badge */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.month_name} {item.year}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.payment_count} payment{item.payment_count !== 1 ? 's' : ''}
                  </p>
                </div>
                {index === 0 && (
                  <span 
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{ background: "rgba(21, 101, 192, 0.1)", color: "#1565c0" }}
                  >
                    Latest
                  </span>
                )}
              </div>

              {/* Revenue Amount */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Total Revenue
                </div>
                <div className="text-2xl font-bold" style={{ color: "#2e7d32" }}>
                  Rs. {item.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Average per payment */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Avg per payment</span>
                  <span className="font-semibold text-gray-700">
                    Rs. {(item.total_revenue / item.payment_count).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {monthlyData.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
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
      )}
    </div>
  );
}
