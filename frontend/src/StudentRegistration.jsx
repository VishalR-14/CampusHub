
import { useState } from "react";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";

export default function StudentRegistration() {
  const initialForm = {
    fullName: "",
    email: "",
    studentId: "",
    department: "",
    studyYear: "",
    password: "",
    confirmPassword: "",
  };

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (form.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            studentId: form.studentId,
            department: form.department,
            studyYear: Number(form.studyYear),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess(true);
      setMessage("Student registered successfully!");
      setForm(initialForm);

    } catch (error) {
      setSuccess(false);
      setMessage(
        error.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "fullName", label: "Full Name", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "studentId", label: "Student ID", type: "text" },
    { name: "department", label: "Department", type: "text" },
    { name: "studyYear", label: "Academic Year", type: "number" },
    { name: "password", label: "Password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password" },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.icon}>
          <UserPlus size={28} />
        </div>

        <h2 style={styles.heading}>Student Registration</h2>

        <p style={styles.description}>
          Create your CampusHub student account.
        </p>

        {message && (
          <div style={{
            ...styles.message,
            background: success ? "#ecfdf3" : "#fef3f2",
            color: success ? "#027a48" : "#b42318",
          }}>
            {success
              ? <CheckCircle size={18} />
              : <AlertCircle size={18} />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {fields.map((field) => (
              <div key={field.name} style={styles.field}>
                <label style={styles.label}>
                  {field.label}
                </label>

                <input
                  style={styles.input}
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  min={field.name === "studyYear" ? 1 : undefined}
                  max={field.name === "studyYear" ? 6 : undefined}
                  required
                  autoComplete={
                    field.name === "password" ? "new-password" :
                    field.name === "confirmPassword" ? "new-password" :
                    field.name === "email" ? "email" : "off"
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating Account..." : "Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    padding: "30px 20px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "650px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    border: "1px solid #eaecf0",
    boxShadow: "0 4px 20px rgba(16,24,40,0.04)",
  },
  icon: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px",
  },
  heading: {
    fontSize: "24px",
    color: "#182230",
    marginBottom: "8px",
  },
  description: {
    color: "#667085",
    marginBottom: "25px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#344054",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d0d5dd",
    borderRadius: "8px",
    outline: "none",
    color: "#182230",
    background: "#ffffff",
  },
  button: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
  message: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
};
