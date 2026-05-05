import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../api/axios";
import MemberForm from "../components/MemberForm";

export default function Members() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members", debouncedSearch],
    queryFn: () => {
      const params = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
      return api.get(`/members/${params}`).then((r) => r.data);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/members/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/members/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setEditing(null);
    },
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

  if (isLoading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="marvel-title text-2xl">Members</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="marvel-btn-primary text-white px-5 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide"
        >
          + Add Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, phone, or member ID..."
            className="w-full px-4 py-3 pl-11 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
        {debouncedSearch && (
          <p className="text-sm text-gray-500 mt-2">
            {members.length} result{members.length !== 1 ? 's' : ''} found for "{debouncedSearch}"
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

      <div className="bg-white rounded-xl overflow-hidden marvel-animate-in" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e0e4e8" }}>
        <table className="w-full text-left">
          <thead style={{ background: "#f5f7fa" }}>
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Member ID</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-gray-100 marvel-row-hover transition-colors">
                <td className="px-6 py-4 font-mono font-semibold" style={{ color: "#1565c0" }}>{m.member_id}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{m.name}</td>
                <td className="px-6 py-4 text-gray-600">{m.phone}</td>
                <td className="px-6 py-4 text-gray-600">{m.join_date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/members/${m.id}`}
                      className="text-sm px-3 py-1.5 rounded font-medium transition-all duration-200 inline-flex items-center gap-1.5"
                      style={{ background: "rgba(46, 125, 50, 0.08)", color: "#2e7d32", border: "1px solid rgba(46, 125, 50, 0.2)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(46, 125, 50, 0.15)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(46, 125, 50, 0.08)"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    <button
                      onClick={() => { setEditing(m); setShowForm(false); }}
                      className="text-sm px-3 py-1.5 rounded font-medium transition-all duration-200"
                      style={{ background: "rgba(21, 101, 192, 0.08)", color: "#1565c0", border: "1px solid rgba(21, 101, 192, 0.2)" }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(21, 101, 192, 0.15)"}
                      onMouseLeave={(e) => e.target.style.background = "rgba(21, 101, 192, 0.08)"}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      className="text-sm px-3 py-1.5 rounded font-medium transition-all duration-200"
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
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  {debouncedSearch ? `No members found matching "${debouncedSearch}"` : "No members yet. Add your first member above."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
