import { useEffect, useState } from "react";
import {
  Users, Plus, Trash2, X, RefreshCw, Mail, UserRound
} from "lucide-react";

const API = "http://localhost:8080/api/clubs";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Technology",
    president: "",
    email: "",
    description: "",
  });

  const loadClubs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Unable to load clubs");

      setClubs(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createClub = async (e) => {
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
        throw new Error(data.message || "Unable to create club");
      }

      setClubs((previous) => [...previous, data]);
      setForm({
        name: "",
        category: "Technology",
        president: "",
        email: "",
        description: "",
      });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteClub = async (id) => {
    if (!window.confirm("Delete this club?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Unable to delete club");

      setClubs((previous) => previous.filter((club) => club.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const categoryColors = {
    Technology: "#2563eb",
    Sports: "#059669",
    Cultural: "#9333ea",
    Academic: "#d97706",
    Social: "#db2777",
    Other: "#64748b",
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Campus Clubs</h1>
          <p style={styles.subtitle}>
            Discover and manage student communities.
          </p>
        </div>

        <div style={styles.actions}>
          <button style={styles.refresh} onClick={loadClubs}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button style={styles.primary} onClick={() => setShowForm(true)}>
            <Plus size={17} /> Create Club
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.summary}>
        <div style={styles.summaryIcon}><Users size={22} /></div>
        <div>
          <strong style={styles.summaryNumber}>{clubs.length}</strong>
          <span style={styles.summaryLabel}>Registered clubs</span>
        </div>
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <form style={styles.formCard} onSubmit={createClub}>
            <div style={styles.formHeader}>
              <div>
                <h2 style={styles.formTitle}>Create New Club</h2>
                <p style={styles.subtitle}>Add a student community.</p>
              </div>
              <button
                type="button"
                style={styles.close}
                onClick={() => setShowForm(false)}
              >
                <X />
              </button>
            </div>

            <label style={styles.label}>Club Name *</label>
            <input
              style={styles.input}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Developers Club"
              required
            />

            <label style={styles.label}>Category</label>
            <select
              style={styles.input}
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Technology</option>
              <option>Sports</option>
              <option>Cultural</option>
              <option>Academic</option>
              <option>Social</option>
              <option>Other</option>
            </select>

            <label style={styles.label}>Club President</label>
            <input
              style={styles.input}
              name="president"
              value={form.president}
              onChange={handleChange}
              placeholder="President's name"
            />

            <label style={styles.label}>Contact Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="club@college.edu"
            />

            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, minHeight: 85, resize: "vertical" }}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the club and its activities"
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
                {saving ? "Creating..." : "Create Club"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={styles.message}>Loading clubs...</p>
      ) : clubs.length === 0 ? (
        <div style={styles.empty}>
          <Users size={40} color="#94a3b8" />
          <h3>No clubs registered yet</h3>
          <p>Create the first student club.</p>
          <button style={styles.primary} onClick={() => setShowForm(true)}>
            <Plus size={16} /> Create Club
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {clubs.map((club) => (
            <article style={styles.card} key={club.id}>
              <div style={styles.cardTop}>
                <div style={styles.clubIcon}>
                  <Users size={23} />
                </div>
                <button
                  style={styles.delete}
                  onClick={() => deleteClub(club.id)}
                  title="Delete club"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <span
                style={{
                  ...styles.category,
                  color: categoryColors[club.category] || "#64748b",
                }}
              >
                {club.category || "Other"}
              </span>

              <h3 style={styles.clubName}>{club.name}</h3>
              <p style={styles.description}>
                {club.description || "A campus community for students."}
              </p>

              <div style={styles.detail}>
                <UserRound size={15} />
                <span>President: {club.president || "Not assigned"}</span>
              </div>

              <div style={styles.detail}>
                <Mail size={15} />
                <span>{club.email || "No contact email"}</span>
              </div>

              <div style={styles.footer}>
                <span><Users size={15} /> {club.memberCount || 0} members</span>
                <span style={styles.active}>Active</span>
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
  subtitle: { color: "#64748b", fontSize: 13, margin: 0 },
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
    minWidth: 190, marginBottom: 22,
  },
  summaryIcon: {
    width: 44, height: 44, display: "grid", placeItems: "center",
    background: "#eff6ff", color: "#2563eb", borderRadius: 10,
  },
  summaryNumber: { display: "block", fontSize: 22 },
  summaryLabel: { display: "block", fontSize: 12, color: "#64748b" },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 17,
  },
  card: {
    background: "#fff", border: "1px solid #e8edf3",
    borderRadius: 13, padding: 20, minWidth: 0,
  },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: 17 },
  clubIcon: {
    width: 46, height: 46, display: "grid", placeItems: "center",
    borderRadius: 12, background: "#eff6ff", color: "#2563eb",
  },
  delete: {
    border: "none", background: "#fff1f2", color: "#e11d48",
    borderRadius: 8, padding: 8, cursor: "pointer",
  },
  category: {
    display: "inline-block", background: "#f1f5f9",
    padding: "5px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
  },
  clubName: { fontSize: 18, margin: "13px 0 7px" },
  description: { color: "#64748b", fontSize: 13, lineHeight: 1.6, minHeight: 42 },
  detail: {
    display: "flex", alignItems: "center", gap: 9,
    fontSize: 12, color: "#64748b", marginTop: 12,
    overflowWrap: "anywhere",
  },
  footer: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    borderTop: "1px solid #edf0f4", paddingTop: 14, marginTop: 18,
    fontSize: 12, color: "#64748b",
  },
  active: { color: "#059669", fontWeight: 700 },
  message: { textAlign: "center", padding: 30, color: "#64748b" },
  empty: {
    display: "grid", justifyItems: "center", gap: 10, padding: 45,
    background: "#fff", border: "1px solid #e8edf3", borderRadius: 13,
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
    outlineColor: "#2563eb",
  },
  formActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 },
  cancel: {
    border: "1px solid #dbe2ea", background: "#fff",
    padding: "10px 15px", borderRadius: 8, cursor: "pointer",
  },
  error: {
    background: "#fef2f2", color: "#b91c1c",
    borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 13,
  },
};