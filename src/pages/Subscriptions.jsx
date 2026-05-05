import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Subscriptions() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptionsGrouped", page],
    queryFn: () => api.get(`/subscriptions/grouped?page=${page}&limit=${limit}`).then((r) => r.data),
  });

  const groupedData = data?.data || [];
  const pagination = data?.pagination || { page: 1, total_pages: 0, total_members: 0 };

  const handleViewMember = (memberId) => {
    navigate(`/members/${memberId}`);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.total_pages) setPage(page + 1);
  };

  if (isLoading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="marvel-title text-xl sm:text-2xl">Subscriptions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {groupedData.length} members (Page {pagination.page} of {pagination.total_pages})
          </p>
        </div>
      </div>

      {/* Grouped Subscriptions */}
      <div className="space-y-4">
        {groupedData.map((group) => (
          <div
            key={group.member_id}
            className="bg-white rounded-xl overflow-hidden marvel-animate-in"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}
          >
            {/* Member Header */}
            <div className="bg-gradient-to-r from-blue-50 to-white p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold" style={{ color: "#0d2137" }}>
                      {group.member_name || "Unknown Member"}
                    </h3>
                    <span
                      className="font-mono text-xs sm:text-sm font-semibold px-3 py-1 rounded"
                      style={{ background: "rgba(21, 101, 192, 0.08)", color: "#1565c0", border: "1px solid rgba(21, 101, 192, 0.2)" }}
                    >
                      {group.member_code}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📞 {group.member_phone || "N/A"}</span>
                    <span>📋 {group.total_subscriptions} subscription{group.total_subscriptions !== 1 ? 's' : ''}</span>
                    <span className="font-semibold" style={{ color: "#2e7d32" }}>
                      ✓ {group.active_subscriptions} active
                    </span>
                    <span className="font-semibold" style={{ color: "#0d2137" }}>
                      💰 Rs. {group.total_amount.toFixed(2)} total
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewMember(group.member_id)}
                  className="marvel-btn-primary text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-200 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <table className="w-full text-left">
                  <thead style={{ background: "#f5f7fa" }}>
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Date</th>
                      <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.subscriptions.map((sub) => (
                      <tr key={sub.id} className="border-t border-gray-100 marvel-row-hover transition-colors">
                        <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm font-medium">{sub.plan.replace("_", " ")}</td>
                        <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{sub.start_date}</td>
                        <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{sub.end_date}</td>
                        <td className="px-4 sm:px-6 py-4 font-semibold text-sm" style={{ color: "#0d2137" }}>
                          Rs. {sub.amount.toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">
                          {sub.payment_date ? new Date(sub.payment_date).toLocaleDateString() : "--"}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap"
                            style={
                              sub.status === "active"
                                ? { background: "rgba(46, 125, 50, 0.08)", color: "#2e7d32", border: "1px solid rgba(46, 125, 50, 0.2)" }
                                : { background: "rgba(198, 40, 40, 0.06)", color: "#c62828", border: "1px solid rgba(198, 40, 40, 0.15)" }
                            }
                          >
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {groupedData.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
            No subscriptions found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 sm:p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold" style={{ color: "#1565c0" }}>{pagination.page}</span> of{" "}
            <span className="font-semibold">{pagination.total_pages}</span>
            {" "}• Total: <span className="font-semibold">{pagination.total_members}</span> members
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: page === 1 ? "#f0f4f8" : "#1565c0",
                color: page === 1 ? "#94a3b8" : "#ffffff",
                border: "1px solid #d0d7e0"
              }}
            >
              ← Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={page === pagination.total_pages}
              className="px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: page === pagination.total_pages ? "#f0f4f8" : "#1565c0",
                color: page === pagination.total_pages ? "#94a3b8" : "#ffffff",
                border: "1px solid #d0d7e0"
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
