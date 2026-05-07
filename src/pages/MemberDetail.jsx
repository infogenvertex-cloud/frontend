import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import SubscriptionForm from "../components/SubscriptionForm";
import Pagination from "../components/Pagination";

export default function MemberDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showSubForm, setShowSubForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: member, isLoading: memberLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: () => api.get(`/members/${id}`).then((r) => r.data),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ["payments", id, currentPage, pageSize],
    queryFn: () => {
      const params = new URLSearchParams({
        member_id: id,
        page: currentPage,
        page_size: pageSize,
      });
      return api.get(`/payments/?${params.toString()}`).then((r) => r.data);
    },
  });

  const payments = paymentsData?.items || [];
  const totalPages = paymentsData?.total_pages || 1;

  const paymentMutation = useMutation({
    mutationFn: (data) => api.post("/payments/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      
      setShowSubForm(false);
      alert("✅ Payment created successfully!");
    },
    onError: (error) => {
      console.error("❌ Error creating payment:", error);
      console.error("❌ Error response:", error.response?.data);
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    },
  });

  if (memberLoading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <Link to="/members" className="hover:underline mb-4 inline-block transition font-medium text-sm uppercase tracking-wide" style={{ color: "#1565c0" }}>
        &larr; Back to Members
      </Link>

      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 marvel-animate-in" style={{ borderLeft: "4px solid #1565c0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", borderLeftWidth: "4px", borderLeftColor: "#1565c0" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-1">
          <h2 className="marvel-title text-xl sm:text-2xl">{member.name}</h2>
          <span
            className="font-mono text-xs sm:text-sm font-semibold px-3 py-1 rounded"
            style={{ background: "rgba(21, 101, 192, 0.08)", color: "#1565c0", border: "1px solid rgba(21, 101, 192, 0.2)" }}
          >
            {member.member_id}
          </span>
        </div>
        <p className="text-gray-500 mt-1 text-sm">Phone: {member.phone}</p>
        <p className="text-gray-500 text-sm">Joined: {member.join_date ? new Date(member.join_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'N/A'}</p>
      </div>

      {/* Payments */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="marvel-title text-lg sm:text-xl">Payments</h3>
        <button
          onClick={() => setShowSubForm(!showSubForm)}
          className="marvel-btn-gold px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide w-full sm:w-auto"
        >
          + Add Payment
        </button>
      </div>

      {showSubForm && (
        <SubscriptionForm
          memberId={parseInt(id)}
          onSubmit={(data) => paymentMutation.mutate(data)}
          onCancel={() => setShowSubForm(false)}
          isSubmitting={paymentMutation.isPending}
        />
      )}

      <div className="bg-white rounded-xl overflow-hidden mb-8 marvel-animate-in overflow-x-auto" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
        <div className="min-w-[700px]">
          <table className="w-full text-left">
            <thead style={{ background: "#f5f7fa" }}>
              <tr>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Date</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 marvel-row-hover transition-colors">
                  <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: "#e3f2fd", color: "#1565c0" }}>
                      {p.plan.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-semibold text-sm" style={{ color: "#0d2137" }}>
                    Rs. {p.amount.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">
                    {new Date(p.payment_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">
                    {p.notes || "--"}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-gray-400 text-sm">
                    No payments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination for Payments */}
      {payments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
