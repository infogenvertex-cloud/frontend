import { useState } from "react";

export default function PaymentForm({ memberId, onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ member_id: memberId, amount: parseFloat(amount) });
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 mb-6 marvel-animate-in" style={{ borderLeft: "4px solid #1565c0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", borderLeftWidth: "4px", borderLeftColor: "#1565c0" }}>
      <h3 className="marvel-title text-lg mb-4">Record Payment</h3>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Amount (Rs.)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
          className="marvel-input w-full rounded-lg px-3 py-2"
          required
        />
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="marvel-btn-primary text-white px-6 py-2 rounded-lg font-semibold uppercase tracking-wide text-sm"
        >
          Record Payment
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-200 text-gray-500 text-sm uppercase tracking-wide"
            style={{ background: "#f0f4f8", border: "1px solid #d0d7e0" }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
