import { useState } from "react";

const PLANS = [
  { value: "1_month", label: "1 Month" },
  { value: "3_month", label: "3 Months" },
  { value: "6_month", label: "6 Months" },
  { value: "12_month", label: "12 Months" },
];

export default function SubscriptionForm({ memberId, onSubmit, onCancel }) {
  const [plan, setPlan] = useState("1_month");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    
    // Validate amount
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }
    
    onSubmit({ 
      member_id: memberId, 
      plan, 
      start_date: startDate,
      amount: parsedAmount
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 mb-6 marvel-animate-in" style={{ borderLeft: "4px solid #1565c0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", borderLeftWidth: "4px", borderLeftColor: "#1565c0" }}>
      <h3 className="marvel-title text-lg mb-4">Add Subscription & Payment</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="marvel-input w-full rounded-lg px-3 py-2"
          >
            {PLANS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
          />
        </div>
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
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="marvel-btn-gold px-6 py-2 rounded-lg font-semibold uppercase tracking-wide text-sm"
        >
          Add Subscription & Record Payment
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
