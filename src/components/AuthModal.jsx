import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  User,
  Lock,
  Phone,
  UserCheck,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export const AuthModal = ({ isOpen, onClose, defaultMode = "login" }) => {
  const { loginUser, registerUser, showToast } = useApp();
  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      if (!username.trim() || !password) {
        setError("Iltimos, login va parolni kiriting!");
        return;
      }

      const res = loginUser({ username, password });
      if (res.success) {
        onClose();
      } else {
        setError(res.error || "Login yoki parol noto'g'ri");
      }
    } else {
      // Register validation
      if (!fullName.trim() || !username.trim() || !phone.trim() || !password) {
        setError("Barcha maydonlarni to'ldirish majburiy!");
        return;
      }

      if (password.length < 4) {
        setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
        return;
      }

      const res = registerUser({ fullName, username, phone, password });
      if (res.success) {
        onClose();
      } else {
        setError(res.error || "Ro'yxatdan o'tishda xatolik yuz berdi");
      }
    }
  };

  // Quick fill for testing Admin
  const fillAdmin = () => {
    setUsername("admin");
    setPassword("1234");
    setMode("login");
    setError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "440px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
              {mode === "login" ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.35rem", borderRadius: "50%" }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Tab switchers */}
        <div style={{ padding: "1.25rem 1.5rem 0", display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className="btn"
            style={{
              flex: 1,
              background: mode === "login" ? "var(--primary-light)" : "var(--bg-card-subtle)",
              color: mode === "login" ? "var(--primary)" : "var(--text-muted)",
              border: mode === "login" ? "1.5px solid var(--primary)" : "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "0.55rem",
              fontWeight: 700,
            }}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className="btn"
            style={{
              flex: 1,
              background: mode === "register" ? "var(--primary-light)" : "var(--bg-card-subtle)",
              color: mode === "register" ? "var(--primary)" : "var(--text-muted)",
              border: mode === "register" ? "1.5px solid var(--primary)" : "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "0.55rem",
              fontWeight: 700,
            }}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
          {error && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                background: "var(--danger-light)",
                color: "var(--danger)",
                fontSize: "0.85rem",
                marginBottom: "1rem",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Full Name for Registration */}
          {mode === "register" && (
            <div className="input-group">
              <label className="input-label">Ism va Familiya</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Masalan: Sardor Rustamov"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          {/* Username / Login */}
          <div className="input-group">
            <label className="input-label">Login</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder={mode === "login" ? "Login yoki admin" : "Yangi login kiriting"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Phone Number for Registration */}
          {mode === "register" && (
            <div className="input-group">
              <label className="input-label">Telefon raqam</label>
              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="input-group">
            <label className="input-label">Parol</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Parolni kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingRight: "2.75rem" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Quick Admin Test Hint */}
          {mode === "login" && (
            <div
              style={{
                marginTop: "0.75rem",
                marginBottom: "1rem",
                padding: "0.75rem 0.9rem",
                background: "var(--bg-card-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px dashed var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <span>Admin kirish: </span>
                <strong style={{ color: "var(--text-main)" }}>admin / 1234</strong>
              </div>
              <button
                type="button"
                onClick={fillAdmin}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}
              >
                Toldirish
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem", padding: "0.75rem" }}
          >
            {mode === "login" ? (
              <>
                <UserCheck size={18} />
                <span>Tizimga kirish</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Ro'yxatdan o'tish</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
