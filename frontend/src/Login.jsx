import { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      onLogin(data);
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <GraduationCap size={34} />
        </div>

        <h1 style={styles.title}>Welcome to CampusHub</h1>
        <p style={styles.subtitle}>Sign in to access your campus dashboard</p>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputWrapper}>
            <Mail size={19} color="#64748b" />
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your college email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label style={styles.label}>Password</label>
          <div style={styles.inputWrapper}>
            <Lock size={19} color="#64748b" />
            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <span style={styles.link}>Contact your administrator</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    padding: 20,
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 430,
    background: "#fff",
    padding: "42px 36px",
    borderRadius: 18,
    boxShadow: "0 15px 45px rgba(15, 23, 42, 0.09)",
  },
  logo: {
    width: 62,
    height: 62,
    borderRadius: 16,
    background: "#1e3a8a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 22px",
  },
  title: {
    textAlign: "center",
    color: "#172554",
    fontSize: 25,
    margin: "0 0 8px",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
    marginBottom: 30,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 8,
    marginTop: 18,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    padding: "0 13px",
    height: 48,
  },
  input: {
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    fontSize: 14,
    background: "transparent",
  },
  eyeButton: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    display: "flex",
  },
  button: {
    width: "100%",
    height: 49,
    marginTop: 26,
    background: "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 12,
  },
  footer: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 13,
    marginTop: 25,
  },
  link: {
    color: "#1d4ed8",
    fontWeight: 600,
  },
};