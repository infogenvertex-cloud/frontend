import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import Subscriptions from "./pages/Subscriptions";
import Visitors from "./pages/Visitors";
import Login from "./pages/Login";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => setIsAuth(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setIsAuth(false);
  };

  if (!isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Layout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:id" element={<MemberDetail />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
