import { useEffect, useState } from "react";
import {
  Users, GraduationCap, CalendarDays, Megaphone,
  TrendingUp, UserPlus, ArrowUpRight, Clock,
  RefreshCw, Activity, Building2
} from "lucide-react";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/students");
      if (!response.ok) throw new Error("Unable to load students");

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
  ];

  const departmentCounts = departments.map((department) => ({
    name: department,
    count: students.filter(
      (student) =>
        (student.department || "").toLowerCase() === department.toLowerCase()
    ).length,
  }));

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "blue",
      description: "Registered students",
    },
    {
      title: "Departments",
      value: new Set(students.map((s) => s.department).filter(Boolean)).size,
      icon: Building2,
      color: "purple",
      description: "Departments represented",
    },
    {
      title: "Campus Events",
      value: "08",
      icon: CalendarDays,
      color: "green",
      description: "Demo event count",
    },
    {
      title: "Announcements",
      value: "05",
      icon: Megaphone,
      color: "orange",
      description: "Demo announcement count",
    },
  ];

  return (
    <div style={styles.page}>
      <section style={styles.welcome}>
        <div>
          <span style={styles.eyebrow}>ADMINISTRATION</span>
          <h1 style={styles.heading}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Manage your campus community from one place.
          </p>
        </div>

        <button style={styles.refresh} onClick={loadStudents}>
          <RefreshCw size={16} /> Refresh
        </button>
      </section>

      <section style={styles.stats}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div style={styles.statCard} key={stat.title}>
              <div style={styles.statTop}>
                <span style={styles.statTitle}>{stat.title}</span>
                <div style={{ ...styles.statIcon, background: colors[stat.color].bg, color: colors[stat.color].text }}>
                  <Icon size={21} />
                </div>
              </div>

              <h2 style={styles.statValue}>
                {loading && stat.title === "Total Students" ? "..." : stat.value}
              </h2>
              <p style={styles.statDescription}>{stat.description}</p>
            </div>
          );
        })}
      </section>

      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h3 style={styles.panelTitle}>Recent Student Registrations</h3>
              <p style={styles.panelSubtitle}>Latest registered students</p>
            </div>
            <GraduationCap size={22} color="#64748b" />
          </div>

          {loading ? (
            <p style={styles.empty}>Loading student records...</p>
          ) : students.length === 0 ? (
            <p style={styles.empty}>No student registrations found.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student</th>
                    <th style={styles.th}>Student ID</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {[...students].reverse().slice(0, 6).map((student) => (
                    <tr key={student.id}>
                      <td style={styles.td}>
                        <div style={styles.studentCell}>
                          <div style={styles.avatar}>
                            {(student.fullName || "S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong style={styles.studentName}>
                              {student.fullName}
                            </strong>
                            <span style={styles.studentEmail}>{student.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>{student.studentId}</td>
                      <td style={styles.td}>{student.department}</td>
                      <td style={styles.td}>Year {student.studyYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h3 style={styles.panelTitle}>Department Overview</h3>
              <p style={styles.panelSubtitle}>Student distribution</p>
            </div>
            <Activity size={21} color="#64748b" />
          </div>

          <div style={styles.departmentList}>
            {departmentCounts.map((department) => {
              const percentage = students.length
                ? (department.count / students.length) * 100
                : 0;

              return (
                <div key={department.name}>
                  <div style={styles.departmentHeading}>
                    <span>{department.name}</span>
                    <strong>{department.count}</strong>
                  </div>
                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p style={styles.note}>
            Department counts are based on registered student records.
          </p>
        </div>
      </section>

      <section style={styles.quickPanel}>
        <div>
          <h3 style={styles.panelTitle}>Quick Administration</h3>
          <p style={styles.panelSubtitle}>Frequently used management actions</p>
        </div>

        <div style={styles.actions}>
          <div style={styles.actionCard}>
            <UserPlus size={22} color="#2563eb" />
            <strong>Student Registration</strong>
            <span>Add a new student to CampusHub</span>
          </div>

          <div style={styles.actionCard}>
            <CalendarDays size={22} color="#7c3aed" />
            <strong>Manage Events</strong>
            <span>Organize campus activities</span>
          </div>

          <div style={styles.actionCard}>
            <Megaphone size={22} color="#ea580c" />
            <strong>Announcements</strong>
            <span>Share important campus updates</span>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <span>CampusHub Administration</span>
        <span><Clock size={14} /> Live student data from database</span>
      </footer>
    </div>
  );
}

const colors = {
  blue: { bg: "#eff6ff", text: "#2563eb" },
  purple: { bg: "#f5f3ff", text: "#7c3aed" },
  green: { bg: "#ecfdf5", text: "#059669" },
  orange: { bg: "#fff7ed", text: "#ea580c" },
};

const styles = {
  page: { padding: "8px 0 30px", color: "#172033" },
  welcome: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", gap: 16, marginBottom: 25,
  },
  eyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#2563eb",
  },
  heading: { fontSize: 27, margin: "8px 0", fontWeight: 750 },
  subtitle: { color: "#64748b", margin: 0, fontSize: 14 },
  refresh: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 15px",
    border: "1px solid #dbe2ea", borderRadius: 9, background: "#fff",
    cursor: "pointer", color: "#334155", fontWeight: 600,
  },
  stats: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 17, marginBottom: 22,
  },
  statCard: {
    background: "#fff", border: "1px solid #e8edf3",
    borderRadius: 13, padding: 20,
  },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statTitle: { fontSize: 13, color: "#64748b", fontWeight: 600 },
  statIcon: {
    width: 42, height: 42, borderRadius: 11,
    display: "grid", placeItems: "center",
  },
  statValue: { fontSize: 30, margin: "13px 0 4px", fontWeight: 750 },
  statDescription: { color: "#94a3b8", fontSize: 12, margin: 0 },
  contentGrid: {
    display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(260px, 1fr)",
    gap: 18, marginBottom: 20,
  },
  panel: {
    background: "#fff", border: "1px solid #e8edf3",
    borderRadius: 13, padding: 20, minWidth: 0,
  },
  panelHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20,
  },
  panelTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 6px" },
  panelSubtitle: { color: "#94a3b8", fontSize: 12, margin: 0 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 },
  th: {
    color: "#94a3b8", fontWeight: 600, padding: "11px 9px",
    borderBottom: "1px solid #edf0f4", whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 9px", borderBottom: "1px solid #f1f3f6",
    color: "#475569", whiteSpace: "nowrap",
  },
  studentCell: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 34, height: 34, borderRadius: 10, background: "#eff6ff",
    color: "#2563eb", display: "grid", placeItems: "center", fontWeight: 700,
  },
  studentName: { display: "block", color: "#1e293b", fontSize: 12 },
  studentEmail: { display: "block", color: "#94a3b8", fontSize: 11, marginTop: 3 },
  empty: { padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 },
  departmentList: { display: "grid", gap: 19 },
  departmentHeading: {
    display: "flex", justifyContent: "space-between",
    fontSize: 12, color: "#475569", marginBottom: 8,
  },
  progressTrack: { height: 7, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" },
  progressBar: { height: "100%", background: "#3b82f6", borderRadius: 10 },
  note: { fontSize: 11, color: "#94a3b8", marginTop: 20 },
  quickPanel: {
    background: "#fff", border: "1px solid #e8edf3",
    borderRadius: 13, padding: 20,
  },
  actions: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 13, marginTop: 18,
  },
  actionCard: {
    display: "flex", flexDirection: "column", gap: 9,
    padding: 17, border: "1px solid #edf0f4", borderRadius: 11,
  },
  footer: {
    display: "flex", justifyContent: "space-between", gap: 10,
    color: "#94a3b8", fontSize: 11, marginTop: 22,
  },
};