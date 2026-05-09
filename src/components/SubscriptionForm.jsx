import { useState, useEffect } from "react";

export default function SubscriptionForm({ memberId, payment, onSubmit, onCancel, isSubmitting = false }) {
  const [days, setDays] = useState("30");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (payment) {
      // Extract days from plan (e.g., "30_day" -> "30")
      const daysFromPlan = payment.plan.split("_")[0];
      setDays(daysFromPlan);
      setAmount(payment.amount.toString());
      setPaymentDate(new Date(payment.payment_date).toISOString().split("T")[0]);
      setNotes(payment.notes || "");
    } else {
      // Reset for new payment
      setDays("30");
      setAmount("");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
  }, [payment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const parsedDays = parseInt(days);
    
    // Validate amount
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }
    
    // Validate days
    if (isNaN(parsedDays) || parsedDays <= 0 || parsedDays > 3650) {
      alert("Please enter a valid number of days (1-3650)");
      return;
    }
    
    // Convert days to plan format (e.g., "30" becomes "30_day")
    const plan = `${parsedDays}_day`;
    
    onSubmit({ 
      member_id: memberId, 
      plan, 
      amount: parsedAmount,
      payment_date: new Date(paymentDate).toISOString(),
      notes: notes.trim() || null,
    });
  };

  const handleAmountChange = (e) => {
    // Only allow numbers and decimal point
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleDaysChange = (e) => {
    // Only allow positive integers
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setDays(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 mb-6 marvel-animate-in" style={{ borderLeft: "4px solid #1565c0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", borderLeftWidth: "4px", borderLeftColor: "#1565c0" }}>
      <h3 className="marvel-title text-lg mb-4">{payment ? "Edit Payment" : "Add Payment"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Days
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={days}
            onChange={handleDaysChange}
            placeholder="30"
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
            min="1"
            max="3650"
          />
          <div className="text-xs text-gray-400 mt-1">
            Enter number of days (1-3650)
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Amount (Rs.)</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="500.00"
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Payment Date</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this payment..."
          className="marvel-input w-full rounded-lg px-3 py-2"
          rows="2"
        />
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="marvel-btn-gold px-6 py-2 rounded-lg font-semibold uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : (payment ? "Update Payment" : "Add Payment")}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-200 text-gray-500 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#f0f4f8", border: "1px solid #d0d7e0" }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
