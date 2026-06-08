import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/app";

function DashboardPage() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

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

    } finally {
      setLoading(false);
    }
  };

  const completedCount = interviews.filter(i => i.isCompleted).length;
  const inProgressCount = interviews.filter(i => !i.isCompleted).length;
  const avgScore = interviews.length > 0 
    ? (interviews.reduce((sum, i) => sum + (i.score || 0), 0) / interviews.length).toFixed(1)
    : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "50px",
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "40px",
              fontWeight: "800",
              margin: "0 0 10px 0",
            }}
          >
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.9)",
              margin: "0",
            }}
          >
            Let's continue preparing for your dream interview
          </p>
        </div>

        {/* Stats Section */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "50px",
          }}
        >
          <div style={statCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={statLabel}>Total Interviews</p>
                <h2 style={statNumber}>{interviews.length}</h2>
              </div>
              <div style={{ fontSize: "48px" }}>📋</div>
            </div>
          </div>

          <div style={statCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={statLabel}>Completed</p>
                <h2 style={statNumber}>{completedCount}</h2>
              </div>
              <div style={{ fontSize: "48px" }}>✅</div>
            </div>
          </div>

          <div style={statCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={statLabel}>In Progress</p>
                <h2 style={statNumber}>{inProgressCount}</h2>
              </div>
              <div style={{ fontSize: "48px" }}>🚀</div>
            </div>
          </div>

          <div style={statCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={statLabel}>Avg Score</p>
                <h2 style={statNumber}>{avgScore}/10</h2>
              </div>
              <div style={{ fontSize: "48px" }}>⭐</div>
            </div>
          </div>
        </div>

        {/* Start Interview Card */}

        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            marginBottom: "50px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              marginTop: 0,
              marginBottom: "30px",
            }}
          >
            🎯 Start New Interview
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Job Role
              </label>
              <input
                type="text"
                placeholder="e.g., Frontend Developer, Product Manager"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                style={selectStyle}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Starting Interview..." : "Start Interview"}
          </button>
        </div>

        {/* Interview History */}

        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              marginTop: 0,
              marginBottom: "30px",
            }}
          >
            📊 Your Interviews
          </h2>

          {interviews.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 40px",
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎓</div>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>No interviews yet</h3>
              <p>Start your first interview above to begin your preparation journey!</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  style={interviewCard}
                  onClick={() => {
                    if (interview.isCompleted) {
                      navigate(`/results/${interview._id}`);
                    } else {
                      navigate(`/interview/${interview._id}`);
                    }
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                    <div>
                      <h3
                        style={{
                          marginTop: 0,
                          marginBottom: "8px",
                          color: "#111827",
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        {interview.role}
                      </h3>
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: 0,
                          color: "#6b7280",
                          fontSize: "14px",
                        }}
                      >
                        Difficulty: <span style={{ fontWeight: "600", color: "#111827" }}>{interview.difficulty}</span>
                      </p>
                    </div>
                    <div style={{ fontSize: "28px" }}>
                      {interview.isCompleted ? "✅" : "⏳"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "16px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Score</p>
                      <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#667eea" }}>
                        {interview.score}/10
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Status</p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: "600",
                          color: interview.isCompleted
                            ? "#10b981"
                            : "#f59e0b",
                        }}
                      >
                        {interview.isCompleted
                          ? "Completed"
                          : "In Progress"}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Questions</p>
                      <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#667eea" }}>
                        {interview.questions.length}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (interview.isCompleted) {
                        navigate(`/results/${interview._id}`);
                      } else {
                        navigate(`/interview/${interview._id}`);
                      }
                    }}
                    style={{
                      width: "100%",
                      marginTop: "16px",
                      padding: "10px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {interview.isCompleted ? "View Results" : "Continue Interview"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const statCard = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(10px)",
};

const statLabel = {
  margin: "0 0 8px 0",
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const statNumber = {
  margin: 0,
  fontSize: "36px",
  fontWeight: "800",
  color: "#667eea",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1.5px solid #e5e7eb",
  fontSize: "15px",
  color: "#18181a",
  boxSizing: "border-box",
  background: "#f9fafb",
  transition: "all 0.3s ease",
  outline: "none",
  fontFamily: "inherit",
};

const selectStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1.5px solid #e5e7eb",
  fontSize: "15px",
  color: "#18181a",
  boxSizing: "border-box",
  background: "#f9fafb",
  transition: "all 0.3s ease",
  outline: "none",
  fontFamily: "inherit",
  cursor: "pointer",
};

const buttonStyle = {
  width: "100%",
  padding: "14px 28px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
};

const interviewCard = {
  background: "#ffffff",
  padding: "24px",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  transition: "all 0.3s ease",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
};

export default DashboardPage;