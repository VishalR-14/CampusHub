import { useEffect, useState } from "react";
import {
  CalendarDays, Clock, MapPin, Plus, Trash2,
  X, Users, RefreshCw
} from "lucide-react";

const API = "http://localhost:8080/api/events";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Technology",
    description: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    capacity: "100",
  });

  const loadEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load events");

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create event");
      }

      setEvents((previous) => [...previous, data]);
      setForm({
        title: "",
        category: "Technology",
        description: "",
        eventDate: "",
        eventTime: "",
        venue: "",
        capacity: "100",
      });
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Unable to create event");
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not delete event");

      setEvents((previous) => previous.filter((event) => event.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete event");
    }
  };

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Campus Events</h1>
          <p style={styles.subtitle}>
            Discover and manage events happening across campus.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.refreshButton} onClick={loadEvents}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
            <Plus size={17} /> Create Event
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.summary}>
        <div style={styles.summaryIcon}>
          <CalendarDays size={23} />
        </div>
        <div>
          <strong style={styles.summaryNumber}>{events.length}</strong>
          <span style={styles.summaryLabel}>Total events</span>
        </div>
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <form style={styles.formCard} onSubmit={createEvent}>
            <div style={styles.formHeader}>
              <div>
                <h2 style={styles.formTitle}>Create New Event</h2>
                <p style={styles.subtitle}>Add an event to the campus calendar.</p>
              </div>
              <button
                type="button"
                style={styles.closeButton}
                onClick={() => setShowForm(false)}
              >
                <X />
              </button>
            </div>

            <label style={styles.label}>Event Title *</label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter event title"
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
              <option>Workshop</option>
              <option>Sports</option>
              <option>Cultural</option>
              <option>Academic</option>
              <option>Other</option>
            </select>

            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the event"
            />

            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Event Date *</label>
                <input
                  style={styles.input}
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={styles.label}>Event Time *</label>
                <input
                  style={styles.input}
                  type="time"
                  name="eventTime"
                  value={form.eventTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label style={styles.label}>Venue *</label>
            <input
              style={styles.input}
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="Event location"
              required
            />

            <label style={styles.label}>Participant Capacity</label>
            <input
              style={styles.input}
              type="number"
              name="capacity"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              required
            />

            <div style={styles.formActions}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={saving}
              >
                {saving ? "Publishing..." : "Publish Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={styles.message}>Loading events...</p>
      ) : events.length === 0 ? (
        <div style={styles.empty}>
          <CalendarDays size={38} color="#94a3b8" />
          <h3>No events yet</h3>
          <p>Create your first campus event to get started.</p>
          <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
            <Plus size={17} /> Create Event
          </button>
        </div>
      ) : (
        <div style={styles.eventGrid}>
          {events.map((event) => (
            <article style={styles.eventCard} key={event.id}>
              <div style={styles.cardTop}>
                <span style={styles.category}>{event.category || "Campus Event"}</span>
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteEvent(event.id)}
                  title="Delete event"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <h3 style={styles.eventTitle}>{event.title}</h3>
              <p style={styles.description}>
                {event.description || "Join us for this campus event."}
              </p>

              <div style={styles.details}>
                <span><CalendarDays size={16} /> {formatDate(event.eventDate)}</span>
                <span><Clock size={16} /> {event.eventTime}</span>
                <span><MapPin size={16} /> {event.venue}</span>
                <span><Users size={16} /> Capacity: {event.capacity}</span>
              </div>

              <div style={styles.cardFooter}>
                <span>CampusHub Event</span>
                <span style={styles.published}>Published</span>
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
    alignItems: "center", gap: 15, flexWrap: "wrap", marginBottom: 22,
  },
  heading: { fontSize: 26, margin: "0 0 7px", fontWeight: 750 },
  subtitle: { fontSize: 13, color: "#64748b", margin: 0 },
  headerActions: { display: "flex", gap: 9 },
  primaryButton: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "11px 16px", border: "none", borderRadius: 9,
    background: "#1e40af", color: "#fff", fontWeight: 600, cursor: "pointer",
  },
  refreshButton: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "10px 13px", border: "1px solid #dbe2ea",
    borderRadius: 9, background: "#fff", cursor: "pointer", color: "#334155",
  },
  summary: {
    display: "flex", alignItems: "center", gap: 14, background: "#fff",
    border: "1px solid #e8edf3", borderRadius: 12,
    padding: 17, marginBottom: 22, width: "fit-content", minWidth: 190,
  },
  summaryIcon: {
    width: 45, height: 45, display: "grid", placeItems: "center",
    background: "#eff6ff", color: "#2563eb", borderRadius: 11,
  },
  summaryNumber: { display: "block", fontSize: 22 },
  summaryLabel: { display: "block", color: "#64748b", fontSize: 12 },
  eventGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 17,
  },
  eventCard: {
    background: "#fff", border: "1px solid #e8edf3",
    borderRadius: 13, padding: 20, minWidth: 0,
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  category: {
    background: "#eff6ff", color: "#2563eb", borderRadius: 20,
    padding: "5px 10px", fontSize: 11, fontWeight: 700,
  },
  deleteButton: {
    border: "none", background: "#fff1f2", color: "#e11d48",
    borderRadius: 8, padding: 8, cursor: "pointer",
  },
  eventTitle: { fontSize: 17, margin: "17px 0 7px" },
  description: { fontSize: 13, color: "#64748b", lineHeight: 1.6, minHeight: 40 },
  details: { display: "grid", gap: 11, marginTop: 18 },
  detailsSpan: {},
  details: { display: "grid", gap: 11, marginTop: 18 },
  cardFooter: {
    borderTop: "1px solid #edf0f4", marginTop: 18, paddingTop: 14,
    display: "flex", justifyContent: "space-between",
    fontSize: 11, color: "#94a3b8",
  },
  published: { color: "#059669", fontWeight: 700 },
  message: { padding: 25, textAlign: "center", color: "#64748b" },
  empty: {
    background: "#fff", border: "1px solid #e8edf3", borderRadius: 13,
    padding: 45, textAlign: "center", display: "grid",
    justifyItems: "center", gap: 10,
  },
  overlay: {
    position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 15, overflowY: "auto",
  },
  formCard: {
    width: "100%", maxWidth: 550, maxHeight: "95vh", overflowY: "auto",
    background: "#fff", borderRadius: 15, padding: 25,
  },
  formHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 15,
  },
  formTitle: { fontSize: 20, margin: "0 0 6px" },
  closeButton: { border: "none", background: "transparent", cursor: "pointer" },
  label: { display: "block", fontSize: 12, fontWeight: 650, margin: "13px 0 7px", color: "#334155" },
  input: {
    width: "100%", boxSizing: "border-box", padding: "11px 12px",
    border: "1px solid #dbe2ea", borderRadius: 8,
    fontSize: 13, outlineColor: "#2563eb",
  },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  formActions: {
    display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22,
  },
  cancelButton: {
    border: "1px solid #dbe2ea", background: "#fff",
    padding: "10px 15px", borderRadius: 8, cursor: "pointer",
  },
  error: {
    background: "#fef2f2", color: "#b91c1c", borderRadius: 8,
    padding: 12, marginBottom: 15, fontSize: 13,
  },
};