import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import Pagination from "../components/Pagination";

export default function Visitors() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading: visitorsLoading, refetch } = useQuery({
    queryKey: ["visitors", currentPage, pageSize],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage,
        page_size: pageSize,
      });
      return api.get(`/visitors/?${params.toString()}`).then((r) => r.data);
    },
  });

  const visitors = data?.items || [];
  const totalPages = data?.total_pages || 1;
  const total = data?.total || 0;

  const validateMobile = (mobile) => {
    // Remove spaces, dashes, and parentheses
    const cleaned = mobile.replace(/[\s-()]/g, '');
    
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
      refetch();
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
      refetch();
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

  if (visitorsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visitors...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="marvel-title text-xl sm:text-2xl">Gym Visitors</h2>
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
          className="marvel-btn-primary text-white px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide w-full sm:w-auto"
        >
          {showForm && !editing ? "Cancel" : "+ Add Visitor"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 marvel-animate-in" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
          <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: "#0d2137" }}>
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
                } focus:outline-none focus:ring-2 focus:border-transparent transition text-sm sm:text-base`}
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
                } focus:outline-none focus:ring-2 focus:border-transparent transition text-sm sm:text-base`}
                style={{ background: "#f9fafb" }}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Enter 10-15 digits, optionally starting with +
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={loading}
                className="marvel-btn-primary text-white px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide disabled:opacity-50 w-full sm:w-auto"
              >
                {loading ? "Saving..." : editing ? "Update Visitor" : "Add Visitor"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm px-6 py-2 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto"
                  style={{ background: "rgba(100, 116, 139, 0.08)", color: "#64748b", border: "1px solid rgba(100, 116, 139, 0.2)" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden marvel-animate-in overflow-x-auto" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
        <div className="min-w-[600px]">
          <table className="w-full text-left">
            <thead style={{ background: "#f5f7fa" }}>
              <tr>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Visited At</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 sm:px-6 py-8 text-center text-gray-400 text-sm">
                    No visitors recorded yet. Add your first visitor above.
                  </td>
                </tr>
              ) : (
                visitors.map((visitor, index) => (
                  <tr key={visitor.id} className="border-t border-gray-100 marvel-row-hover transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-mono font-semibold text-sm" style={{ color: "#7b1fa2" }}>{index + 1}</td>
                    <td className="px-4 sm:px-6 py-4 font-medium text-sm" style={{ color: "#0d2137" }}>{visitor.name}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{visitor.mobile}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{formatDate(visitor.visited_at)}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(visitor)}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded font-medium transition-all duration-200"
                          style={{ background: "rgba(123, 31, 162, 0.08)", color: "#7b1fa2", border: "1px solid rgba(123, 31, 162, 0.2)" }}
                          onMouseEnter={(e) => e.target.style.background = "rgba(123, 31, 162, 0.15)"}
                          onMouseLeave={(e) => e.target.style.background = "rgba(123, 31, 162, 0.08)"}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(visitor.id, visitor.name)}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded font-medium transition-all duration-200"
                          style={{ background: "rgba(198, 40, 40, 0.06)", color: "#c62828", border: "1px solid rgba(198, 40, 40, 0.15)" }}
                          onMouseEnter={(e) => e.target.style.background = "rgba(198, 40, 40, 0.12)"}
                          onMouseLeave={(e) => e.target.style.background = "rgba(198, 40, 40, 0.06)"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm" style={{ color: "#64748b" }}>
        Total Visitors: {total}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
