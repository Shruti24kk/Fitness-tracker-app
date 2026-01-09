import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { getToken, setToken } from "./api";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function NavBar() {
  const nav = useNavigate();
  const authed = !!getToken();
  return (
    <nav>
      <div className="links">
        <Link to="/"><strong>FTWP</strong></Link>
        {authed && <Link to="/dashboard">Dashboard</Link>}
      </div>
      <div>
        {authed ? (
          <button className="secondary" onClick={() => { setToken(null); nav("/login"); }}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="badge">Sign in</Link>
        )}
      </div>
    </nav>
  );
}

function RequireAuth({ children }) {
  const authed = !!getToken();
  return authed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="container">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      </Routes>
    </div>
  );
}
