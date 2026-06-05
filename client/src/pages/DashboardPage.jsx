import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/app";

function DashboardPage() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");

  useEffect(() => {

    const fetchData = async () => {

      try {

        const userResponse =
          await api.get("/auth/me");

        setUser(userResponse.data);

        const historyResponse =
          await api.get("/interviews/history");

        setInterviews(
          historyResponse.data.interviews
        );

      } catch (error) {

        console.log(error);

      }
    };

    fetchData();

  }, []);

  const startInterview = async () => {

    if (!role.trim()) {
      alert("Please enter a role");
      return;
    }

    try {

      const response =
        await api.post(
          "/interviews/start",
          {
            role,
            difficulty
          }
        );

      navigate(
        `/interview/${response.data.interview._id}`
      );

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#111827",
          }}
        >
          Welcome back, {user?.name}
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "10px",
          }}
        >
          Prepare for interviews and track your progress.
        </p>
      </div>

      {/* Stats Section */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={statCard}>
          <h3>Total Interviews</h3>
          <h1>{interviews.length}</h1>
        </div>

        <div style={statCard}>
          <h3>Completed</h3>
          <h1>
            {
              interviews.filter(
                (i) => i.isCompleted
              ).length
            }
          </h1>
        </div>

        <div style={statCard}>
          <h3>In Progress</h3>
          <h1>
            {
              interviews.filter(
                (i) => !i.isCompleted
              ).length
            }
          </h1>
        </div>
      </div>

      {/* Start Interview Card */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Start New Interview
        </h2>

        <input
          type="text"
          placeholder="Enter Role (Frontend Developer)"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            marginBottom: "20px",
          }}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button
          onClick={startInterview}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "14px 28px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Start Interview
        </button>
      </div>

      {/* Interview History */}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Interview History
        </h2>

        {interviews.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
            }}
          >
            No Interviews Found
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
            }}
          >
            {interviews.map((interview) => (
              <div
                key={interview._id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "20px",
                  transition: "0.3s",
                  background: "#ffffff",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    color: "#111827",
                  }}
                >
                  {interview.role}
                </h3>

                <p>
                  <strong>Difficulty:</strong>{" "}
                  {interview.difficulty}
                </p>

                <p>
                  <strong>Score:</strong>{" "}
                  {interview.score}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        interview.isCompleted
                          ? "green"
                          : "#f59e0b",
                      fontWeight: "600",
                    }}
                  >
                    {interview.isCompleted
                      ? "Completed"
                      : "In Progress"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
const statCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

export default DashboardPage;