import { useEffect, useState } from "react";
import {
  Megaphone, Plus, Trash2, X, RefreshCw,
  Clock, Building2, AlertCircle
} from "lucide-react";

const API = "http://localhost:8080/api/announcements";

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    department: "Administration",
    priority: "Normal",
    message: "",
  });

  const loadAnnouncements = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Unable to load announcements");

      setItems(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const publishAnnouncement = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to publish announcement");
      }

      setItems((previous) => [data, ...previous]);
      setForm({
        title: "",
        department: "Administration",
        priority: "Normal",
        message: "",
      });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Unable to delete announcement");

      setItems((previous) => previous.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (value) => {
    if (!value) return "Recently published";

    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Announcements</h1>
          <p style={styles.subtitle}>
            Publish important information and campus updates.
          </p>
        </div>

        <div style={styles.actions}>
          <button style={styles.refresh} onClick={loadAnnouncements}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button style={styles.primary} onClick={() => setShowForm(true)}>
            <Plus size={17} /> New Announcement
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.summary}>
        <div style={styles.summaryIcon}><Megaphone size={23} /></div>
        <div>
          <strong style={styles.summaryNumber}>{items.length}</strong>
          <span style={styles.summaryLabel}>Published announcements</span>
        </div>
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <form style={styles.formCard} onSubmit={publishAnnouncement}>
            <div style={styles.formHeader}>
              <div>
                <h2 style={styles.formTitle}>New Announcement</h2>
                <p style={styles.subtitle}>Share an update with your campus.</p>
              </div>
              <button
                type="button"
                style={styles.close}
                onClick={() => setShowForm(false)}
              >
                <X />
              </button>
            </div>

            <label style={styles.label}>Announcement Title *</label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter announcement title"
              required
            />

            <label style={styles.label}>Department</label>
            <select
              style={styles.input}
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <option>Administration</option>
              <option>Academic Office</option>
              <option>Student Affairs</option>
              <option>Placement Cell</option>
              <option>Central Library</option>
              <option>Examination Cell</option>
            </select>

            <label style={styles.label}>Priority</label>
            <select
              style={styles.input}
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option>Normal</option>
              <option>Important</option>
              <option>Urgent</option>
            </select>

            <label style={styles.label}>Message *</label>
            <textarea
              style={styles.textarea}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your announcement..."
              required
            />

            <div style={styles.formActions}>
              <button
                type="button"
                style={styles.cancel}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" style={styles.primary} disabled={saving}>
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={styles.message}>Loading announcements...</p>
      ) : items.length === 0 ? (
        <div style={styles.empty}>
          <Megaphone size={40} color="#94a3b8" />
          <h3>No announcements yet</h3>
          <p>Publish the first campus announcement.</p>
          <button style={styles.primary} onClick={() => setShowForm(true)}>
            <Plus size={16} /> Create Announcement
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <article style={styles.card} key={item.id}>
              <div style={styles.cardIcon}><Megaphone size={21} /></div>

              <div style={styles.content}>
                <div style={styles.cardTop}>
                  <span style={{
                    ...styles.priority,
                    ...(item.priority === "Urgent"
                      ? styles.urgent
                      : item.priority === "Important"
                        ? styles.important
                        : styles.normal),
                  }}>
                    {item.priority || "Normal"}
                  </span>

                  <button
                    style={styles.delete}
                    onClick={() => deleteAnnouncement(item.id)}
                    title="Delete announcement"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 style={styles.title}>{item.title}</h3>
                <p style={styles.messageText}>{item.message}</p>

                <div style={styles.meta}>
                  <span><Building2 size={14} /> {item.department || "Administration"}</span>
                  <span><Clock size={14} /> {formatDate(item.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "8px 0 30px", color: "#172033" },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: 15, marginBottom: 22,
  },
  heading: { fontSize: 26, margin: "0 0 7px", fontWeight: 750 },
  subtitle: { fontSize: 13, color: "#64748b", margin: 0 },
  actions: { display: "flex", gap: 9 },
  primary: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "11px 15px", border: "none",
    borderRadius: 9, background: "#1e40af", color: "#fff",
    fontWeight: 600, cursor: "pointer",
  },
  refresh: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "10px 13px", border: "1px solid #dbe2ea",
    borderRadius: 9, background: "#fff", cursor: "pointer",
  },
  summary: {
    display: "flex", alignItems: "center", gap: 13,
    background: "#fff", border: "1px solid #e8edf3",
    borderRadius: 12, padding: 17, width: "fit-content",
    minWidth: 210, marginBottom: 22,
  },
  summaryIcon: {
    width: 44, height: 44, display: "grid", placeItems: "center",
    background: "#fff7ed", color: "#ea580c", borderRadius: 10,
  },
  summaryNumber: { display: "block", fontSize: 22 },
  summaryLabel: { display: "block", fontSize: 12, color: "#64748b" },
  list: { display: "grid", gap: 15 },
  card: {
    display: "flex", gap: 16, background: "#fff",
    border: "1px solid #e8edf3", borderRadius: 13, padding: 20,
  },
  cardIcon: {
    width: 43, height: 43, flexShrink: 0,
    display: "grid", placeItems: "center", borderRadius: 11,
    background: "#eff6ff", color: "#2563eb",
  },
  content: { flex: 1, minWidth: 0 },
  cardTop: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  priority: {
    padding: "5px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 700,
  },
  normal: { color: "#2563eb", background: "#eff6ff" },
  important: { color: "#c2410c", background: "#fff7ed" },
  urgent: { color: "#dc2626", background: "#fef2f2" },
  delete: {
    border: "none", background: "#fff1f2", color: "#e11d48",
    borderRadius: 8, padding: 8, cursor: "pointer",
  },
  title: { fontSize: 17, margin: "13px 0 7px" },
  messageText: { color: "#64748b", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  meta: {
    display: "flex", flexWrap: "wrap", gap: 18,
    marginTop: 14, color: "#94a3b8", fontSize: 11,
  },
  message: { textAlign: "center", padding: 30, color: "#64748b" },
  empty: {
    display: "grid", justifyItems: "center", gap: 10,
    padding: 45, background: "#fff",
    border: "1px solid #e8edf3", borderRadius: 13,
  },
  overlay: {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(15,23,42,.55)", display: "flex",
    alignItems: "center", justifyContent: "center",
    padding: 15, overflowY: "auto",
  },
  formCard: {
    width: "100%", maxWidth: 520, maxHeight: "95vh",
    overflowY: "auto", background: "#fff", borderRadius: 15, padding: 25,
  },
  formHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 15,
  },
  formTitle: { fontSize: 20, margin: "0 0 6px" },
  close: { border: "none", background: "transparent", cursor: "pointer" },
  label: { display: "block", fontSize: 12, fontWeight: 650, margin: "13px 0 7px" },
  input: {
    width: "100%", boxSizing: "border-box", padding: "11px 12px",
    border: "1px solid #dbe2ea", borderRadius: 8, fontSize: 13,
  },
  textarea: {
    width: "100%", boxSizing: "border-box", padding: "11px 12px",
    border: "1px solid #dbe2ea", borderRadius: 8,
    minHeight: 120, resize: "vertical", fontSize: 13,
  },
  formActions: {
    display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22,
  },
  cancel: {
    border: "1px solid #dbe2ea", background: "#fff",
    padding: "10px 15px", borderRadius: 8, cursor: "pointer",
  },
  error: {
    background: "#fef2f2", color: "#b91c1c",
    borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 13,
  },
};