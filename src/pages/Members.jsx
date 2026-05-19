import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../api/axios";
import MemberForm from "../components/MemberForm";
import Pagination from "../components/Pagination";

export default function Members() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Debounce search input to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to first page when month filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth]);

  const { data, isLoading } = useQuery({
    queryKey: ["members", debouncedSearch, selectedMonth, currentPage, pageSize],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage,
        page_size: pageSize,
      });
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      if (selectedMonth) {
        params.append('month', selectedMonth);
      }
      return api.get(`/members/?${params.toString()}`).then((r) => r.data);
    },
  });

  const members = data?.items || [];
  const totalPages = data?.total_pages || 1;
  const total = data?.total || 0;

  const createMutation = useMutation({
    mutationFn: (data) => {
      console.log("🚀 Creating new member - API call starting");
      console.log("📤 Data being sent to API:", data);
      console.log("🔍 Join date details:", {
        join_date: data.join_date,
        type: typeof data.join_date,
        isValidDate: data.join_date ? !isNaN(new Date(data.join_date).getTime()) : false
      });
      return api.post("/members/", data);
    },
    onSuccess: (response, variables) => {
      console.log("✅ Member creation successful!");
      console.log("📥 API Response:", response.data);
      console.log("📋 Original variables sent:", variables);
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setShowForm(false);
    },
    onError: (error, variables) => {
      console.error("❌ Member creation failed!");
      console.error("🚨 Error details:", error);
      console.error("📋 Variables that failed:", variables);
      if (error.response) {
        console.error("📥 Server response:", error.response.data);
        console.error("🔢 Status code:", error.response.status);
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      console.log("🔄 Updating member - API call starting");
      console.log("🆔 Member ID:", id);
      console.log("📤 Update data being sent:", data);
      console.log("🔍 Join date details:", {
        join_date: data.join_date,
        type: typeof data.join_date,
        isValidDate: data.join_date ? !isNaN(new Date(data.join_date).getTime()) : false
      });
      return api.put(`/members/${id}`, data);
    },
    onSuccess: (response, variables) => {
      console.log("✅ Member update successful!");
      console.log("📥 API Response:", response.data);
      console.log("📋 Original variables sent:", variables);
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setEditing(null);
    },
    onError: (error, variables) => {
      console.error("❌ Member update failed!");
      console.error("🚨 Error details:", error);
      console.error("📋 Variables that failed:", variables);
      if (error.response) {
        console.error("📥 Server response:", error.response.data);
        console.error("🔢 Status code:", error.response.status);
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/members/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete member "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedMonth("");
  };

  // Generate month options for the last 24 months
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value: monthValue, label: monthLabel });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  if (isLoading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="marvel-title text-xl sm:text-2xl">Members</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="marvel-btn-primary text-white px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide w-full sm:w-auto"
        >
          + Add Member
        </button>
      </div>

      {/* Search Bar and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, phone, or member ID..."
            className="w-full px-4 py-3 pl-11 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
            style={{ background: "#ffffff" }}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              title="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Month Filter and Clear Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 sm:flex-none">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
              style={{ background: "#ffffff" }}
            >
              <option value="">All Months</option>
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {(debouncedSearch || selectedMonth) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Info */}
        {debouncedSearch && (
          <p className="text-sm text-gray-500">
            {total} result{total !== 1 ? 's' : ''} found for "{debouncedSearch}"
            {selectedMonth && ` in ${monthOptions.find(m => m.value === selectedMonth)?.label}`}
          </p>
        )}
        {!debouncedSearch && selectedMonth && (
          <p className="text-sm text-gray-500">
            Showing {members.length} of {total} members joined in {monthOptions.find(m => m.value === selectedMonth)?.label}
          </p>
        )}
        {!debouncedSearch && !selectedMonth && total > 0 && (
          <p className="text-sm text-gray-500">
            Showing {members.length} of {total} members
          </p>
        )}
      </div>

      {showForm && (
        <MemberForm
          key="new-member"
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editing && (
        <MemberForm
          key={`edit-member-${editing.id}`}
          member={editing}
          onSubmit={(data) => updateMutation.mutate({ id: editing.id, data })}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="bg-white rounded-xl overflow-hidden marvel-animate-in overflow-x-auto" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
        <div className="min-w-[700px]">
          <table className="w-full text-left">
            <thead style={{ background: "#f5f7fa" }}>
              <tr>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">S.NO</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Member ID</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, index) => (
                <tr key={m.id} className="border-t border-gray-100 marvel-row-hover transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-mono font-semibold text-sm" style={{ color: "#7b1fa2" }}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-mono font-semibold text-sm" style={{ color: "#1565c0" }}>{m.member_id}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-700 font-medium text-sm">{m.name}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{m.phone}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">
                    {m.join_date ? new Date(m.join_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/members/${m.id}`}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded font-medium transition-all duration-200 inline-flex items-center gap-1.5"
                        style={{ background: "rgba(46, 125, 50, 0.08)", color: "#2e7d32", border: "1px solid rgba(46, 125, 50, 0.2)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(46, 125, 50, 0.15)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(46, 125, 50, 0.08)"}
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </Link>
                      <button
                        onClick={() => { setEditing(m); setShowForm(false); }}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded font-medium transition-all duration-200"
                        style={{ background: "rgba(21, 101, 192, 0.08)", color: "#1565c0", border: "1px solid rgba(21, 101, 192, 0.2)" }}
                        onMouseEnter={(e) => e.target.style.background = "rgba(21, 101, 192, 0.15)"}
                        onMouseLeave={(e) => e.target.style.background = "rgba(21, 101, 192, 0.08)"}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded font-medium transition-all duration-200"
                        style={{ background: "rgba(198, 40, 40, 0.06)", color: "#c62828", border: "1px solid rgba(198, 40, 40, 0.15)" }}
                        onMouseEnter={(e) => e.target.style.background = "rgba(198, 40, 40, 0.12)"}
                        onMouseLeave={(e) => e.target.style.background = "rgba(198, 40, 40, 0.06)"}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-gray-400 text-sm">
                    {debouncedSearch || selectedMonth ? 
                      `No members found${debouncedSearch ? ` matching "${debouncedSearch}"` : ''}${selectedMonth ? ` for ${monthOptions.find(m => m.value === selectedMonth)?.label}` : ''}` : 
                      "No members yet. Add your first member above."
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
