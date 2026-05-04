import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import SubscriptionForm from "../components/SubscriptionForm";

export default function MemberDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showSubForm, setShowSubForm] = useState(false);

  const { data: member, isLoading: memberLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: () => api.get(`/members/${id}`).then((r) => r.data),
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscriptions", id],
    queryFn: () => api.get(`/subscriptions/member/${id}`).then((r) => r.data),
  });

  const subMutation = useMutation({
    mutationFn: (data) => api.post("/subscriptions/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setShowSubForm(false);
    },
  });

  if (memberLoading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <Link to="/members" className="hover:underline mb-4 inline-block transition font-medium text-sm uppercase tracking-wide" style={{ color: "#1565c0" }}>
        &larr; Back to Members
      </Link>

      <div className="bg-white rounded-xl p-6 mb-6 marvel-animate-in" style={{ borderLeft: "4px solid #1565c0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", borderLeftWidth: "4px", borderLeftColor: "#1565c0" }}>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="marvel-title text-2xl">{member.name}</h2>
          <span
            className="font-mono text-sm font-semibold px-3 py-1 rounded"
            style={{ background: "rgba(21, 101, 192, 0.08)", color: "#1565c0", border: "1px solid rgba(21, 101, 192, 0.2)" }}
          >
            {member.member_id}
          </span>
        </div>
        <p className="text-gray-500 mt-1">Phone: {member.phone}</p>
        <p className="text-gray-500">Joined: {member.join_date}</p>
      </div>

      {/* Subscriptions & Payments Merged */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="marvel-title text-xl">Subscriptions & Payments</h3>
        <button
          onClick={() => setShowSubForm(!showSubForm)}
          className="marvel-btn-gold px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide"
        >
          + Add Subscription & Payment
        </button>
      </div>

      {showSubForm && (
        <SubscriptionForm
          memberId={parseInt(id)}
          onSubmit={(data) => subMutation.mutate(data)}
          onCancel={() => setShowSubForm(false)}
        />
      )}

      <div className="bg-white rounded-xl overflow-hidden mb-8 marvel-animate-in" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
        <table className="w-full text-left">
          <thead style={{ background: "#f5f7fa" }}>
            <tr>
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
                <td className="px-6 py-4 text-gray-700">{s.plan.replace("_", " ")}</td>
                <td className="px-6 py-4 text-gray-600">{s.start_date}</td>
                <td className="px-6 py-4 text-gray-600">{s.end_date}</td>
                <td className="px-6 py-4 font-semibold" style={{ color: "#0d2137" }}>
                  {s.amount ? `Rs. ${s.amount.toFixed(2)}` : "--"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {s.payment_date ? new Date(s.payment_date).toLocaleDateString() : "--"}
                </td>
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
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
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
