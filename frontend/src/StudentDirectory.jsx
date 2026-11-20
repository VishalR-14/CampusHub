
import { useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/students");

      if (!response.ok) {
        throw new Error("Unable to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ padding: "24px", width: "100%" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <h2 style={{ color: "#182230", marginBottom: "8px" }}>
            Student Directory
          </h2>
          <p style={{ color: "#667085" }}>
            View all students registered in CampusHub.
          </p>
        </div>

        <button
          onClick={fetchStudents}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div style={{
        background: "white",
        border: "1px solid #eaecf0",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "20px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <Users color="#2563eb" size={28} />
          <div>
            <h3 style={{ color: "#182230", fontSize: "24px" }}>
              {students.length}
            </h3>
            <p style={{ color: "#667085" }}>Total registered students</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p style={{ color: "#dc2626" }}>{error}</p>
      ) : students.length === 0 ? (
        <p>No students registered yet.</p>
      ) : (
        <div style={{
          overflowX: "auto",
          background: "white",
          border: "1px solid #eaecf0",
          borderRadius: "12px"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            minWidth: "650px"
          }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["ID", "Full Name", "Email", "Student ID", "Department", "Year"].map(
                  (heading) => (
                    <th key={heading} style={{
                      padding: "16px",
                      color: "#475467",
                      fontSize: "13px",
                      borderBottom: "1px solid #eaecf0"
                    }}>
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  {[
                    student.id,
                    student.fullName,
                    student.email,
                    student.studentId,
                    student.department || "-",
                    student.studyYear || "-"
                  ].map((value, index) => (
                    <td key={index} style={{
                      padding: "16px",
                      color: "#344054",
                      fontSize: "14px",
                      borderBottom: "1px solid #f2f4f7"
                    }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
