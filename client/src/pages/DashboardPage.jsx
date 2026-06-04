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
    <div>

      <h1>
        Welcome {user?.name}
      </h1>

      <hr />

      <h2>
        Start Interview
      </h2>

      <input
        type="text"
        placeholder="Enter Role"
        value={role}
        onChange={(e) =>
          setRole(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={difficulty}
        onChange={(e) =>
          setDifficulty(e.target.value)
        }
      >
        <option value="Easy">
          Easy
        </option>

        <option value="Medium">
          Medium
        </option>

        <option value="Hard">
          Hard
        </option>
      </select>

      <br />
      <br />

      <button
        onClick={startInterview}
      >
        Start Interview
      </button>

      <hr />

      <h2>
        Interview History
      </h2>

      {
        interviews.length === 0 ? (
          <p>
            No Interviews Found
          </p>
        ) : (
          interviews.map(
            (interview) => (

              <div
                key={interview._id}
                style={{
                  border: "1px solid gray",
                  padding: "10px",
                  marginBottom: "10px"
                }}
              >

                <h3>
                  {interview.role}
                </h3>

                <p>
                  Difficulty:
                  {" "}
                  {interview.difficulty}
                </p>

                <p>
                  Score:
                  {" "}
                  {interview.score}
                </p>

                <p>
                  Status:
                  {" "}
                  {
                    interview.isCompleted
                      ? "Completed"
                      : "In Progress"
                  }
                </p>

              </div>

            )
          )
        )
      }

    </div>
  );
}

export default DashboardPage;