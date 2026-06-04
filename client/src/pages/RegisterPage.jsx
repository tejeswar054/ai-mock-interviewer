import { useState } from "react";
import api from "../services/app";
import { useNavigate } from "react-router-dom";

function RegisterPage() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response =
      await api.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      console.log("Success:", response.data);
      alert("Registration successful!");
      navigate("/dashboard");

    } catch (error) {

      console.error("Error details:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);

    }
  };

  return (
    <div>

      <h1>Register</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>
            setName(e.target.value)
          }
        />

        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
        />

        <br />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}

export default RegisterPage;