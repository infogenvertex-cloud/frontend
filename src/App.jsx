import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import Visitors from "./pages/Visitors";
import ExpiringSoon from "./pages/ExpiringSoon";
import Login from "./pages/Login";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    console.log("🚀 App Component Mounted");
    console.log("  Authentication Status:", isAuth);
    console.log("  Token exists:", !!localStorage.getItem("token"));
    console.log("  Admin data:", localStorage.getItem("admin"));
  }, []);

  useEffect(() => {
    console.log("🔄 Auth state changed:", isAuth);
  }, [isAuth]);

  const handleLogin = () => {
    console.log("✅ Login successful");
    setIsAuth(true);
  };

  const handleLogout = () => {
    console.log("👋 Logout triggered");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setIsAuth(false);
  };

  if (!isAuth) {
    console.log("🔒 Rendering Login page");
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  console.log("🏠 Rendering authenticated app");
  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:id" element={<MemberDetail />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/expiring" element={<ExpiringSoon />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
