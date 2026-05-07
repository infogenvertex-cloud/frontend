import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Pagination from "../components/Pagination";

export default function ExpiringSoon() {
  const [daysFilter, setDaysFilter] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    console.log("⏰ ExpiringSoon Component Mounted");
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [daysFilter]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["expiring", daysFilter, currentPage, pageSize],
    queryFn: async () => {
      console.log(`🔄 Fetching members expiring within ${daysFilter} days (page ${currentPage})...`);
      try {
        const params = new URLSearchParams({
          days: daysFilter,
          page: currentPage,
          page_size: pageSize,
        });
        const response = await api.get(`/expiring/?${params.toString()}`);
        console.log(`✅ Found ${response.data.total} expiring members, showing page ${currentPage}`);
        return response.data;
      } catch (err) {
        console.error("❌ Error fetching expiring members:", err);
        throw err;
      }
    },
  });

  const expiringMembers = data?.items || [];
  const totalPages = data?.total_pages || 1;
  const total = data?.total || 0;

  const getUrgencyColor = (days) => {
    if (days <= 2) return { bg: "#ffebee", color: "#c62828", border: "#ef5350" };
    if (days <= 5) return { bg: "#fff3e0", color: "#e65100", border: "#ff9800" };
    return { bg: "#e3f2fd", color: "#1565c0", border: "#42a5f5" };
  };

  const getUrgencyLabel = (days) => {
    if (days === 0) return "EXPIRES TODAY";
    if (days === 1) return "EXPIRES TOMORROW";
    if (days <= 2) return "URGENT";
    if (days <= 5) return "SOON";
    return "UPCOMING";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expiring members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold mb-2">Error loading data</p>
          <p className="text-sm">{error?.message || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="marvel-title text-2xl sm:text-3xl mb-2" style={{ letterSpacing: "0.1em" }}>
            EXPIRING SOON
          </h2>
          <p className="text-sm text-gray-500">
            Members whose subscriptions are expiring within {daysFilter} days
          </p>
        </div>

        {/* Days Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Show:
          </label>
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(Number(e.target.value))}
            className="marvel-input rounded-lg px-4 py-2 text-sm font-medium"
            style={{ minWidth: "150px" }}
          >
            <option value={3}>Next 3 days</option>
            <option value={7}>Next 7 days</option>
            <option value={14}>Next 14 days</option>
            <option value={30}>Next 30 days</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 border-l-4 border-red-500">
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            Urgent (≤2 days)
          </div>
          <div className="text-3xl font-bold text-red-700">
            {total > 0 ? expiringMembers.filter(m => m.days_until_expiry <= 2).length : 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">on this page</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border-l-4 border-orange-500">
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            Soon (3-5 days)
          </div>
          <div className="text-3xl font-bold text-orange-700">
            {total > 0 ? expiringMembers.filter(m => m.days_until_expiry > 2 && m.days_until_expiry <= 5).length : 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">on this page</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-l-4 border-blue-500">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            Upcoming (6+ days)
          </div>
          <div className="text-3xl font-bold text-blue-700">
            {total > 0 ? expiringMembers.filter(m => m.days_until_expiry > 5).length : 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">on this page</div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl overflow-hidden marvel-animate-in overflow-x-auto" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
        <div className="min-w-[800px]">
          <table className="w-full text-left">
            <thead style={{ background: "#f5f7fa" }}>
              <tr>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Member ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Last Plan
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Days Left
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {expiringMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 sm:px-6 py-12 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-4xl">🎉</div>
                      <div>
                        <div className="font-semibold text-gray-600 mb-1">All Good!</div>
                        <div>No members have subscriptions expiring within the next {daysFilter} days.</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                expiringMembers.map((member) => {
                  const urgency = getUrgencyColor(member.days_until_expiry);
                  const urgencyLabel = getUrgencyLabel(member.days_until_expiry);
                  
                  return (
                    <tr key={member.id} className="border-t border-gray-100 marvel-row-hover transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap inline-block"
                          style={{
                            background: urgency.bg,
                            color: urgency.color,
                            border: `1px solid ${urgency.border}`,
                          }}
                        >
                          {urgencyLabel}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-mono font-semibold text-sm" style={{ color: "#1565c0" }}>
                        {member.member_id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-700 font-medium text-sm">
                        {member.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">
                        {member.phone}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: "#e3f2fd", color: "#1565c0" }}>
                          {member.last_plan?.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">
                        {formatDate(member.expiry_date)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className="text-lg font-bold"
                          style={{ color: urgency.color }}
                        >
                          {member.days_until_expiry}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          {member.days_until_expiry === 1 ? "day" : "days"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Link
                          to={`/members/${member.id}`}
                          className="text-xs sm:text-sm px-3 py-1.5 rounded font-medium transition-all duration-200 inline-flex items-center gap-1.5"
                          style={{ background: "rgba(46, 125, 50, 0.08)", color: "#2e7d32", border: "1px solid rgba(46, 125, 50, 0.2)" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(46, 125, 50, 0.15)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(46, 125, 50, 0.08)"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Renew
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4" style={{ borderLeft: "4px solid #1565c0" }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How expiry is calculated:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>1 Month plan = 30 days from payment date</li>
              <li>3 Month plan = 90 days from payment date</li>
              <li>6 Month plan = 180 days from payment date</li>
              <li>12 Month plan = 365 days from payment date</li>
            </ul>
            <p className="mt-2 text-blue-700">
              💡 Click "Renew" to add a new payment and extend the member's subscription.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
