import { useState } from "react";
import api from "../services/app";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      console.log("Success:", response.data);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error details:",
        error.response?.data || error.message
      );

      alert(
        `Error: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Left Side */}
      <div
        style={{
          flex: 1,
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            marginBottom: "20px",
            fontWeight: "800",
            lineHeight: "1.2",
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "500px",
            lineHeight: "1.8",
            marginBottom: "40px",
          }}
        >
          Continue your AI-powered interview preparation and track your progress towards your dream job.
        </p>

        <div style={{ display: "flex", gap: "30px" }}>
          <div>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🎯</div>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}>Smart Practice</p>
          </div>
          <div>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📊</div>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}>Real Feedback</p>
          </div>
          <div>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🚀</div>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}>Get Hired</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div
        style={{
          width: "450px",
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.15)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
          }}
        >
          <h2
            style={{
              marginBottom: "10px",
              color: "#111827",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Sign In
          </h2>

          <p
            style={{
              marginBottom: "30px",
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            Access your interview preparation account.
          </p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#667eea",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "18px",
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

const buttonStyle = {
  width: "100%",
  padding: "14px",
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

export default LoginPage;