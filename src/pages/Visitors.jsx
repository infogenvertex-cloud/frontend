import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await api.get("/visitors");
      setVisitors(response.data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  const validateMobile = (mobile) => {
    // Remove spaces, dashes, and parentheses
    const cleaned = mobile.replace(/[\s\-\(\)]/g, '');
    
    // Check if it contains only digits and optional + at start
    const mobileRegex = /^\+?\d{10,15}$/;
    
    if (!cleaned) {
      return "Mobile number is required";
    }
    
    if (!mobileRegex.test(cleaned)) {
      return "Mobile number must be 10-15 digits, optionally starting with +";
    }
    
    return null;
  };

  const validateName = (name) => {
    if (!name || name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const nameError = validateName(formData.name);
    const mobileError = validateMobile(formData.mobile);
    
    if (nameError || mobileError) {
      setErrors({
        name: nameError,
        mobile: mobileError,
      });
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      if (editing) {
        await api.put(`/visitors/${editing.id}`, formData);
      } else {
        await api.post("/visitors", formData);
      }
      setFormData({ name: "", mobile: "" });
      setShowForm(false);
      setEditing(null);
      fetchVisitors();
    } catch (error) {
      console.error("Error saving visitor:", error);
      if (error.response?.data?.detail) {
        // Handle validation errors from backend
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          const newErrors = {};
          detail.forEach(err => {
            const field = err.loc[err.loc.length - 1];
            newErrors[field] = err.msg;
          });
          setErrors(newErrors);
        } else {
          alert(detail);
        }
      } else {
        alert("Failed to save visitor");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visitor) => {
    setEditing(visitor);
    setFormData({
      name: visitor.name,
      mobile: visitor.mobile,
    });
    setShowForm(true);
    setErrors({});
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ name: "", mobile: "" });
    setErrors({});
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete visitor "${name}"?`)) return;
    
    try {
      await api.delete(`/visitors/${id}`);
      fetchVisitors();
    } catch (error) {
      console.error("Error deleting visitor:", error);
      alert("Failed to delete visitor");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="marvel-title text-2xl">Gym Visitors</h2>
        <button
          onClick={() => {
            if (showForm && !editing) {
              handleCancel();
            } else {
              setShowForm(true);
              setEditing(null);
              setFormData({ name: "", mobile: "" });
              setErrors({});
            }
          }}
          className="marvel-btn-primary text-white px-5 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide"
        >
          {showForm && !editing ? "Cancel" : "+ Add Visitor"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 mb-6 marvel-animate-in" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#0d2137" }}>
            {editing ? "Edit Visitor" : "Add New Visitor"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#0d2137" }}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-purple-500"
                } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                style={{ background: "#f9fafb" }}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#0d2137" }}>
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="e.g., +1234567890 or 1234567890"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.mobile ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-purple-500"
                } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                style={{ background: "#f9fafb" }}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Enter 10-15 digits, optionally starting with +
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="marvel-btn-primary text-white px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide disabled:opacity-50"
              >
                {loading ? "Saving..." : editing ? "Update Visitor" : "Add Visitor"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{ background: "rgba(100, 116, 139, 0.08)", color: "#64748b", border: "1px solid rgba(100, 116, 139, 0.2)" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden marvel-animate-in" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
        <table className="w-full text-left">
          <thead style={{ background: "#f5f7fa" }}>
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Visited At</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  No visitors recorded yet. Add your first visitor above.
                </td>
              </tr>
            ) : (
              visitors.map((visitor, index) => (
                <tr key={visitor.id} className="border-t border-gray-100 marvel-row-hover transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold" style={{ color: "#7b1fa2" }}>{index + 1}</td>
                  <td className="px-6 py-4 font-medium" style={{ color: "#0d2137" }}>{visitor.name}</td>
                  <td className="px-6 py-4 text-gray-600">{visitor.mobile}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(visitor.visited_at)}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(visitor)}
                      className="text-sm px-3 py-1 rounded font-medium transition-all duration-200"
                      style={{ background: "rgba(123, 31, 162, 0.08)", color: "#7b1fa2", border: "1px solid rgba(123, 31, 162, 0.2)" }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(123, 31, 162, 0.15)"}
                      onMouseLeave={(e) => e.target.style.background = "rgba(123, 31, 162, 0.08)"}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(visitor.id, visitor.name)}
                      className="text-sm px-3 py-1 rounded font-medium transition-all duration-200"
                      style={{ background: "rgba(198, 40, 40, 0.06)", color: "#c62828", border: "1px solid rgba(198, 40, 40, 0.15)" }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(198, 40, 40, 0.12)"}
                      onMouseLeave={(e) => e.target.style.background = "rgba(198, 40, 40, 0.06)"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm" style={{ color: "#64748b" }}>
        Total Visitors: {visitors.length}
      </div>
    </div>
  );
}
