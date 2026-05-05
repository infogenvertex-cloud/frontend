import { useState } from "react";

export default function MemberForm({ member, onSubmit, onCancel }) {
  const [name, setName] = useState(member?.name ?? "");
  const [phone, setPhone] = useState(member?.phone ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, phone });
    setName("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 mb-6 marvel-animate-in" style={{ borderLeft: "4px solid #1565c0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", borderLeftWidth: "4px", borderLeftColor: "#1565c0" }}>
      <h3 className="marvel-title text-lg mb-4">
        {member ? "Edit Member" : "Add New Member"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="919876543210"
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="marvel-btn-primary text-white px-6 py-2 rounded-lg font-semibold uppercase tracking-wide text-sm"
        >
          {member ? "Update" : "Add Member"}
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
