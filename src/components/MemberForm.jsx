import { useState, useEffect } from "react";

export default function MemberForm({ member, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);

  // Update form fields when member prop changes (for editing)
  useEffect(() => {
    console.log("🔧 MemberForm useEffect triggered");
    console.log("👤 Member prop:", member);
    
    if (member) {
      console.log("🔄 Updating form fields for editing");
      console.log("📝 Setting form values from member:", {
        id: member.id,
        name: member.name,
        phone: member.phone,
        join_date: member.join_date
      });
      
      setName(member.name || "");
      setPhone(member.phone || "");
      
      if (member.join_date) {
        const formattedDate = new Date(member.join_date).toISOString().split('T')[0];
        console.log("📅 Setting join date:", {
          original: member.join_date,
          formatted: formattedDate
        });
        setJoinDate(formattedDate);
      } else {
        const todayDate = new Date().toISOString().split('T')[0];
        console.log("📅 No join_date in member, using today:", todayDate);
        setJoinDate(todayDate);
      }
    } else {
      console.log("🆕 Resetting form for new member");
      setName("");
      setPhone("");
      const todayDate = new Date().toISOString().split('T')[0];
      setJoinDate(todayDate);
      console.log("📅 Set join_date to today:", todayDate);
    }
  }, [member]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = { 
      name, 
      phone, 
      join_date: joinDate 
    };
    
    console.log("📤 Form Submission Started");
    console.log("📋 Form Data Being Sent:", formData);
    console.log("🔍 Join Date Details:", {
      rawValue: joinDate,
      dateObject: new Date(joinDate),
      isValidDate: !isNaN(new Date(joinDate).getTime()),
      isoString: new Date(joinDate).toISOString()
    });
    
    onSubmit(formData);
    
    // Reset form
    console.log("🔄 Resetting form fields");
    setName("");
    setPhone("");
    const todayDate = new Date().toISOString().split('T')[0];
    setJoinDate(todayDate);
    console.log("📅 Reset join_date to:", todayDate);
  };

  const handleJoinDateChange = (e) => {
    const newDate = e.target.value;
    console.log("📅 Join Date Changed:", {
      oldValue: joinDate,
      newValue: newDate,
      dateObject: new Date(newDate),
      isValid: !isNaN(new Date(newDate).getTime())
    });
    setJoinDate(newDate);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 mb-6 marvel-animate-in" style={{ borderLeft: "4px solid #1565c0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8", borderLeftWidth: "4px", borderLeftColor: "#1565c0" }}>
      <h3 className="marvel-title text-lg mb-4">
        {member ? "Edit Member" : "Add New Member"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              console.log("👤 Name changed:", e.target.value);
              setName(e.target.value);
            }}
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              console.log("📱 Phone changed:", e.target.value);
              setPhone(e.target.value);
            }}
            placeholder="919876543210"
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Join Date</label>
          <input
            type="date"
            value={joinDate}
            onChange={handleJoinDateChange}
            className="marvel-input w-full rounded-lg px-3 py-2"
            required
          />
          <div className="text-xs text-gray-400 mt-1">
            Current: {joinDate} ({new Date(joinDate).toLocaleDateString()})
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="marvel-btn-primary text-white px-6 py-2 rounded-lg font-semibold uppercase tracking-wide text-sm"
          onClick={() => console.log("🔘 Submit button clicked")}
        >
          {member ? "Update" : "Add Member"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={() => {
              console.log("❌ Cancel button clicked");
              onCancel();
            }}
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
