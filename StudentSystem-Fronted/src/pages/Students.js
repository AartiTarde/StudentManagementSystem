import React, { useEffect, useState, useMemo, useCallback } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

// Constants 
const COURSES = [
  "Computer Science", "Data Science", "Cybersecurity",
  "Software Engineering", "Artificial Intelligence",
  "Cloud Computing", "Information Technology", "Electronics Engineering",
];

const EMPTY_FORM = { name: "", email: "", age: "", course: "" };

// Validation s
function validateStudent(form) {
  const errors = {};
  if (!form.name.trim())             errors.name   = "Name is required.";
  else if (form.name.trim().length < 2) errors.name = "At least 2 characters.";

  if (!form.email.trim())            errors.email  = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email.";

  const age = Number(form.age);
  if (!form.age)                     errors.age    = "Age is required.";
  else if (isNaN(age) || age < 1 || age > 120) errors.age = "Age must be 1–120.";

  if (!form.course)                  errors.course = "Please select a course.";
  return errors;
}

// Course badge colors
const BADGE_COLORS = {
  "Computer Science":        { bg: "rgba(99,102,241,0.12)",  text: "#818cf8", border: "rgba(99,102,241,0.25)"  },
  "Data Science":            { bg: "rgba(20,184,166,0.12)",  text: "#2dd4bf", border: "rgba(20,184,166,0.25)"  },
  "Cybersecurity":           { bg: "rgba(239,68,68,0.10)",   text: "#f87171", border: "rgba(239,68,68,0.22)"   },
  "Software Engineering":    { bg: "rgba(34,197,94,0.10)",   text: "#4ade80", border: "rgba(34,197,94,0.22)"   },
  "Artificial Intelligence": { bg: "rgba(245,158,11,0.10)",  text: "#fbbf24", border: "rgba(245,158,11,0.22)"  },
  "Cloud Computing":         { bg: "rgba(59,130,246,0.10)",  text: "#60a5fa", border: "rgba(59,130,246,0.22)"  },
  "Information Technology":  { bg: "rgba(168,85,247,0.10)",  text: "#c084fc", border: "rgba(168,85,247,0.22)"  },
  "Electronics Engineering": { bg: "rgba(249,115,22,0.10)",  text: "#fb923c", border: "rgba(249,115,22,0.22)"  },
};
const defaultBadge = { bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.12)" };

// reusable components
function Spinner({ size = 16, color = "#fff" }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: `2px solid rgba(255,255,255,0.15)`, borderTopColor: color,
      borderRadius: "50%", animation: "spin 0.65s linear infinite", flexShrink: 0,
    }} />
  );
}

function Badge({ text }) {
  const c = BADGE_COLORS[text] || defaultBadge;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 99, padding: "3px 10px", fontSize: 11.5, fontWeight: 500,
      whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function FormField({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={s.label}>{label}</label>
      {children}
      {error && <span style={s.fieldError}>{error}</span>}
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: t.type === "error" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.10)",
          border: `1px solid ${t.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
          borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 13.5,
          backdropFilter: "blur(20px)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          animation: "slideIn 0.2s ease",
          minWidth: 240,
        }}>
          <span style={{ fontSize: 16 }}>{t.type === "error" ? "✕" : "✓"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// Student Form Modal
function StudentModal({ student, onClose, onSubmit, saving }) {
  const isEdit = !!student;
  const [form,   setForm]   = useState(student ? { name: student.name, email: student.email, age: String(student.age), course: student.course } : EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateStudent(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, age: Number(form.age) });
  };

  const inputStyle = (err) => ({
    ...s.input, borderColor: err ? "#ef4444" : "rgba(255,255,255,0.1)",
  });

  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...s.modal, animation: "fadeUp 0.2s ease" }}>
        <div style={s.modalHeader}>
          <h2 style={s.modalTitle}>{isEdit ? "Edit Student" : "Add New Student"}</h2>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Full Name" error={errors.name}>
              <input value={form.name} onChange={set("name")} placeholder="e.g. Riya Desai" style={inputStyle(errors.name)}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = errors.name ? "#ef4444" : "rgba(255,255,255,0.1)"}
              />
            </FormField>
            <FormField label="Age" error={errors.age}>
              <input value={form.age} onChange={set("age")} placeholder="e.g. 21" type="number" min={1} max={120} style={inputStyle(errors.age)}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = errors.age ? "#ef4444" : "rgba(255,255,255,0.1)"}
              />
            </FormField>
          </div>

          <FormField label="Email Address" error={errors.email}>
            <input value={form.email} onChange={set("email")} placeholder="e.g. riya@example.com" type="email" style={inputStyle(errors.email)}
              onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = errors.email ? "#ef4444" : "rgba(255,255,255,0.1)"}
            />
          </FormField>

          <FormField label="Course" error={errors.course}>
            <select value={form.course} onChange={set("course")} style={{ ...inputStyle(errors.course), color: form.course ? "#fff" : "rgba(255,255,255,0.3)" }}
              onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = errors.course ? "#ef4444" : "rgba(255,255,255,0.1)"}
            >
              <option value="" disabled>Select a course…</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button type="button" onClick={onClose} style={s.cancelBtn}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...s.primaryBtn, opacity: saving ? 0.7 : 1 }}>
              {saving ? <><Spinner size={13} /> Saving…</> : (isEdit ? "Save Changes" : "Add Student")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

//Delete Dialog
function DeleteDialog({ student, onClose, onConfirm, deleting }) {
  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...s.modal, maxWidth: 360, textAlign: "center", animation: "fadeUp 0.2s ease" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 20 }}>🗑️</div>
        <h2 style={{ ...s.modalTitle, textAlign: "center", marginBottom: 8 }}>Delete student?</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 24 }}>
          This will permanently remove <strong style={{ color: "rgba(255,255,255,0.75)" }}>{student?.name}</strong>. This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onClose} style={s.cancelBtn}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting} style={{ ...s.deleteBtn, opacity: deleting ? 0.7 : 1 }}>
            {deleting ? <><Spinner size={13} color="#fff" /> Deleting…</> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function Students() {
  const [students,     setStudents]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [toasts,       setToasts]       = useState([]);
  const navigate = useNavigate();

  /* toast helper */
  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  /* fetch */
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/student");
      const data = res.data?.data ?? res.data ?? [];
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast(err.message || "Failed to load students.", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  /* add / edit submit */
  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editTarget) {
        await API.put(`/student/${editTarget.id}`, data);
        toast(`${data.name} updated successfully.`);
      } else {
        await API.post("/student", data);
        toast(`${data.name} added successfully.`);
      }
      setModalOpen(false);
      setEditTarget(null);
      fetchStudents();
    } catch (err) {
      toast(err.message || "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* delete */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/student/${deleteTarget.id}`);
      toast(`${deleteTarget.name} removed.`);
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      toast(err.message || "Delete failed.", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* filter */
  const courses = useMemo(() => [...new Set(students.map(s => s.course))].sort(), [students]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s =>
      (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.course.toLowerCase().includes(q)) &&
      (!courseFilter || s.course === courseFilter)
    );
  }, [students, search, courseFilter]);

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={s.page}>
      <Toast toasts={toasts} />

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <div style={s.logoMark}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#6366f1"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="#818cf8"/></svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>Student MS</span>
        </div>

        <nav style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { icon: "◈", label: "Students", active: true },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              borderRadius: 9, cursor: "pointer",
              background: item.active ? "rgba(99,102,241,0.15)" : "transparent",
              color: item.active ? "#818cf8" : "rgba(255,255,255,0.4)",
              fontSize: 13.5, fontWeight: item.active ? 500 : 400,
            }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(99,102,241,0.2)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>A</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: "#fff" }}>admin</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>Students</h1>
            <p style={s.pageSubtitle}>{students.length} total · {filtered.length} shown</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={fetchStudents} style={s.iconBtn} title="Refresh">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M23 4v6h-6M1 20v-6h6" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => { setEditTarget(null); setModalOpen(true); }} style={s.addBtn}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
              Add Student
            </button>
          </div>
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email or course…"
              style={{ ...s.input, paddingLeft: 38, paddingRight: search ? 36 : 14 }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>
          <select
            value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
            style={{ ...s.input, minWidth: 160, width: "auto", color: courseFilter ? "#fff" : "rgba(255,255,255,0.3)" }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <option value="">All courses</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={s.tableCard}>
          {loading ? (
            <div style={s.emptyState}><Spinner size={28} color="#6366f1" /></div>
          ) : filtered.length === 0 ? (
            <div style={s.emptyState}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>No students found</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                {search || courseFilter ? "Try adjusting your search or filter." : "Click 'Add Student' to get started."}
              </div>
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["#", "Student", "Email", "Age", "Course", "Enrolled", ""].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, i) => (
                  <tr key={student.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...s.td, color: "rgba(255,255,255,0.25)", fontSize: 12, width: 40 }}>{student.id}</td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {student.name[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: "#fff", fontSize: 13.5 }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{student.email}</td>
                    <td style={{ ...s.td, color: "rgba(255,255,255,0.6)" }}>{student.age}</td>
                    <td style={s.td}><Badge text={student.course} /></td>
                    <td style={{ ...s.td, color: "rgba(255,255,255,0.3)", fontSize: 12.5, whiteSpace: "nowrap" }}>{formatDate(student.createdDate)}</td>
                    <td style={{ ...s.td, width: 80 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => { setEditTarget(student); setModalOpen(true); }}
                          style={s.rowIconBtn}
                          title="Edit"
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "#818cf8"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(student)}
                          style={s.rowIconBtn}
                          title="Delete"
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#f87171"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer stats */}
        {!loading && students.length > 0 && (
          <div style={{ marginTop: 16, display: "flex", gap: 20, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            <span>Total: <strong style={{ color: "rgba(255,255,255,0.5)" }}>{students.length}</strong></span>
            <span>Courses: <strong style={{ color: "rgba(255,255,255,0.5)" }}>{courses.length}</strong></span>
            <span>Avg age: <strong style={{ color: "rgba(255,255,255,0.5)" }}>{students.length ? Math.round(students.reduce((a, s) => a + s.age, 0) / students.length) : 0}</strong></span>
          </div>
        )}
      </main>

      {/* Modals */}
      {modalOpen && (
        <StudentModal
          student={editTarget}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
          onSubmit={handleSubmit}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          student={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}

// Styles
const s = {
  page: {
    display: "flex", minHeight: "100vh",
    background: "#0a0a0f",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: "#fff",
  },
  sidebar: {
    width: 220, background: "rgba(255,255,255,0.02)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh", flexShrink: 0,
  },
  sidebarLogo: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  logoMark: {
    width: 30, height: 30, borderRadius: 8,
    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 12px", width: "100%", border: "none",
    background: "none", borderRadius: 8, cursor: "pointer",
    color: "rgba(255,255,255,0.35)", fontSize: 13.5,
    fontFamily: "inherit", transition: "background 0.12s, color 0.12s",
  },
  main: { flex: 1, padding: 32, minWidth: 0, overflowY: "auto" },
  topbar: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 24, gap: 16, flexWrap: "wrap",
  },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.5px" },
  pageSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 4 },
  addBtn: {
    height: 38, padding: "0 16px", background: "#6366f1", color: "#fff",
    border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 500,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
    fontFamily: "inherit", transition: "background 0.12s",
  },
  iconBtn: {
    width: 38, height: 38, background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.12s",
  },
  input: {
    height: 40, padding: "0 14px", width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 9, color: "#fff", fontSize: 13.5,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    transition: "border-color 0.15s",
  },
  tableCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14, overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "11px 14px", textAlign: "left", fontSize: 11,
    color: "rgba(255,255,255,0.3)", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.7px",
    background: "rgba(255,255,255,0.02)",
  },
  td: { padding: "13px 14px", fontSize: 13.5, color: "rgba(255,255,255,0.75)", verticalAlign: "middle" },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "64px 24px", textAlign: "center",
  },
  rowIconBtn: {
    width: 30, height: 30, borderRadius: 7,
    background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    color: "rgba(255,255,255,0.4)", transition: "all 0.12s",
  },
  /* Modal */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16,
    backdropFilter: "blur(4px)",
  },
  modal: {
    width: "100%", maxWidth: 460,
    background: "#13131a", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 18, padding: "24px 24px 24px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.3px" },
  closeBtn: {
    width: 30, height: 30, borderRadius: 7,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.12s",
  },
  label: { fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.45)", letterSpacing: "0.3px" },
  fieldError: { fontSize: 11.5, color: "#f87171", marginTop: 2 },
  cancelBtn: {
    height: 38, padding: "0 18px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 9, color: "rgba(255,255,255,0.6)", fontSize: 13.5, fontWeight: 500,
    cursor: "pointer", fontFamily: "inherit", transition: "background 0.12s",
  },
  primaryBtn: {
    height: 38, padding: "0 18px",
    background: "#6366f1", border: "none",
    borderRadius: 9, color: "#fff", fontSize: 13.5, fontWeight: 500,
    cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7,
    transition: "background 0.12s",
  },
  deleteBtn: {
    height: 38, padding: "0 18px",
    background: "#dc2626", border: "none",
    borderRadius: 9, color: "#fff", fontSize: 13.5, fontWeight: 500,
    cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7,
    transition: "background 0.12s",
  },
};

// Keyframes
if (typeof document !== "undefined" && !document.getElementById("students-keyframes")) {
  const el = document.createElement("style");
  el.id = "students-keyframes";
  el.textContent = `
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideIn { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2) !important; }
    select option { background: #13131a; color: #fff; }
    * { box-sizing: border-box; }
  `;
  document.head.appendChild(el);
}