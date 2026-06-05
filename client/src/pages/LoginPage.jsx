import { useState } from "react";
import api from "../services/app";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #111827, #1f2937)",
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
            fontSize: "52px",
            marginBottom: "20px",
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#d1d5db",
            maxWidth: "500px",
            lineHeight: "1.7",
          }}
        >
          Continue your AI-powered interview preparation
          and track your progress.
        </p>
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
              color: "#1647b1",
            }}
          >
            Login
          </h2>

          <p
            style={{
              marginBottom: "30px",
              color: "#131416",
            }}
          >
            Sign in to continue.
          </p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
          >
            Login
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#6b7280",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Create Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  color: "#18181a",
  boxSizing: "border-box",
  background: "#afc6c6"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

export default LoginPage;