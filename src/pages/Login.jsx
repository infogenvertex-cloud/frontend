import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { MarvelMLogo } from "../components/MarvelIcons";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🔐 Login attempt:", { email });

    try {
      console.log("📤 Sending login request...");
      const res = await api.post("/auth/login", { email, password });
      console.log("✅ Login successful:", { 
        hasToken: !!res.data.access_token,
        name: res.data.name,
        email: res.data.email 
      });
      
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("admin", JSON.stringify({ name: res.data.name, email: res.data.email }));
      
      console.log("💾 Token and admin data saved to localStorage");
      console.log("🔄 Calling onLogin callback");
      
      onLogin();
      navigate("/");
      
      console.log("🏠 Navigating to dashboard");
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden tech-bg">
      {/* Decorative tech circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(21,101,192,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(21,101,192,0.04) 0%, transparent 70%)" }} />
        {/* Horizontal tech lines */}
        <div className="absolute top-1/4 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(21,101,192,0.08), transparent)" }} />
        <div className="absolute top-3/4 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(21,101,192,0.06), transparent)" }} />
      </div>

      <div className="bg-white rounded-2xl p-8 w-full max-w-md marvel-animate-in relative z-10" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderTop: "4px solid #1565c0" }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MarvelMLogo size={72} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wide" style={{ color: "#0d2137" }}>
            MARVEL FITNESS
          </h1>
          <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ background: "linear-gradient(90deg, #1565c0, #42a5f5)" }} />
          <p className="text-gray-400 mt-3 text-xs uppercase tracking-widest font-semibold">Power Up Your Fitness</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="marvel-input w-full rounded-lg px-4 py-2.5"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="marvel-input w-full rounded-lg px-4 py-2.5"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="marvel-btn-primary w-full text-white py-2.5 rounded-lg font-bold uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? "Assembling..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
