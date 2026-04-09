import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

//Validation
function validateLogin(form) {
  const errors = {};
  if (!form.username.trim()) errors.username = "Username is required.";
  if (!form.password)        errors.password = "Password is required.";
  else if (form.password.length < 4) errors.password = "At least 4 characters.";
  return errors;
}

// Input component 
function Field({ label, id, type = "text", value, onChange, error, placeholder, right }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={id}
          style={{
            ...styles.input,
            borderColor: error ? "#ef4444" : "rgba(255,255,255,0.1)",
            paddingRight: right ? 44 : 14,
          }}
          onFocus={e => { e.target.style.borderColor = error ? "#ef4444" : "#6366f1"; e.target.style.boxShadow = `0 0 0 3px ${error ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.15)"}` }}
          onBlur={e  => { e.target.style.borderColor = error ? "#ef4444" : "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none" }}
        />
        {right}
      </div>
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

// Main
export default function Login() {
  const [form,     setForm]     = useState({ username: "", password: "" });
  const [errors,   setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");
  const [touched,  setTouched]  = useState({});
  const navigate = useNavigate();

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setTouched(t => ({ ...t, [field]: true }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    setTouched({ username: true, password: true });
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");
    try {
      const res = await API.post("/auth/login", form);
      const token = res.data?.data?.token || res.data?.token;
      localStorage.setItem("token", token);
      navigate("/students");
    } catch (err) {
      setApiError(err.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background grid pattern */}
      <div style={styles.gridBg} />

      <div style={styles.card}>
        {/* Logo mark */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={styles.logoMark}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#6366f1"/>
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="#818cf8"/>
            </svg>
          </div>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.sub}>Sign in to Student Management System</p>
        </div>

        {apiError && (
          <div style={styles.apiError}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{flexShrink:0}}>
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field
            label="Username" id="username" placeholder="Enter your username"
            value={form.username} onChange={set("username")} error={errors.username}
          />

          <Field
            label="Password" id="password" type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password} onChange={set("password")} error={errors.password}
            right={
              <button type="button" onClick={() => setShowPass(v => !v)} style={styles.eyeBtn} tabIndex={-1}>
                {showPass
                  ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/></svg>
                  : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/></svg>
                }
              </button>
            }
          />

          <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
            {loading
              ? <><Spinner /> Signing in…</>
              : "Sign In →"
            }
          </button>
        </form>

        <p style={styles.hint}>
          Default: <code style={styles.code}>admin</code> / <code style={styles.code}>1234</code>
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      display:"inline-block", width:14, height:14, marginRight:8,
      border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff",
      borderRadius:"50%", animation:"spin 0.65s linear infinite"
    }}/>
  );
}

// Styles 
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0f",
    padding: 24,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  gridBg: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  },
  card: {
    width: "100%", maxWidth: 400,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "40px 36px 32px",
    backdropFilter: "blur(20px)",
    position: "relative",
    boxShadow: "0 0 60px rgba(99,102,241,0.08), 0 24px 48px rgba(0,0,0,0.4)",
  },
  logoMark: {
    width: 48, height: 48,
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 14,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24, fontWeight: 700, color: "#fff",
    margin: "0 0 6px", letterSpacing: "-0.5px",
  },
  sub: { fontSize: 13.5, color: "rgba(255,255,255,0.4)", margin: 0 },
  label: { fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.3px" },
  input: {
    width: "100%", height: 44, padding: "0 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#fff", fontSize: 14,
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", padding: 4, borderRadius: 6,
  },
  fieldError: { fontSize: 12, color: "#f87171", marginTop: 2 },
  apiError: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 10, padding: "10px 14px", color: "#f87171",
    fontSize: 13, marginBottom: 6,
  },
  submitBtn: {
    height: 46, borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#fff", fontSize: 14.5, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    gap: 4, marginTop: 4, letterSpacing: "0.2px",
    transition: "transform 0.1s, opacity 0.15s",
    fontFamily: "inherit",
  },
  hint: { textAlign: "center", marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.25)" },
  code: {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 5, padding: "1px 6px", color: "rgba(255,255,255,0.5)", fontSize: 11.5,
  },
};

// Inject keyframe animation
if (typeof document !== "undefined" && !document.getElementById("login-keyframes")) {
  const s = document.createElement("style");
  s.id = "login-keyframes";
  s.textContent = `@keyframes spin { to { transform: rotate(360deg); } } input::placeholder { color: rgba(255,255,255,0.2) !important; } * { box-sizing: border-box; }`;
  document.head.appendChild(s);
}