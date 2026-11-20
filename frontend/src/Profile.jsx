
import {
  UserRound, Mail, GraduationCap, Hash,
  Building2, ShieldCheck, CalendarDays
} from "lucide-react";

export default function Profile({ user }) {
  const initials = (user?.fullName || "Student")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const details = [
    { label: "Full Name", value: user?.fullName, icon: UserRound },
    { label: "Email Address", value: user?.email, icon: Mail },
    { label: "Student ID", value: user?.studentId, icon: Hash },
    { label: "Department", value: user?.department, icon: Building2 },
    { label: "Academic Role", value: "Student", icon: GraduationCap },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1>My Profile</h1>
          <p>View your personal and academic information.</p>
        </div>
      </div>

      <section style={styles.profileCard}>
        <div style={styles.avatar}>{initials}</div>
        <h2>{user?.fullName || "Student"}</h2>
        <p>{user?.email}</p>
        <span style={styles.status}>
          <ShieldCheck size={15} /> Active Account
        </span>
      </section>

      <section style={styles.detailsCard}>
        <div style={styles.sectionHeader}>
          <div>
            <h3>Personal Information</h3>
            <p>Your registered CampusHub account details</p>
          </div>
          <UserRound size={22} color="#64748b" />
        </div>

        <div style={styles.grid}>
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div style={styles.detailItem} key={item.label}>
                <div style={styles.detailIcon}>
                  <Icon size={19} />
                </div>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value || "Not available"}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={styles.infoCard}>
        <div style={styles.infoIcon}>
          <CalendarDays size={22} />
        </div>
        <div>
          <h3>CampusHub Student Account</h3>
          <p>
            Your account provides access to campus events, clubs,
            announcements and student services.
          </p>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: { padding: "8px 0 30px", color: "#172033" },
  header: { marginBottom: 22 },
  profileCard: {
    background: "#fff",
    border: "1px solid #e8edf3",
    borderRadius: 14,
    padding: "30px 20px",
    textAlign: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: "50%",
    background: "#1e40af",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 15px",
    fontSize: 27,
    fontWeight: 700,
  },
  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "#059669",
    background: "#ecfdf5",
    borderRadius: 20,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 600,
    marginTop: 10,
  },
  detailsCard: {
    background: "#fff",
    border: "1px solid #e8edf3",
    borderRadius: 14,
    padding: 22,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 22,
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: 13,
  },
  detailIcon: {
    width: 42,
    height: 42,
    display: "grid",
    placeItems: "center",
    borderRadius: 10,
    background: "#eff6ff",
    color: "#2563eb",
  },
  infoCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 15,
    background: "#eff6ff",
    borderRadius: 13,
    padding: 20,
    marginTop: 20,
  },
  infoIcon: { color: "#2563eb" },
};
