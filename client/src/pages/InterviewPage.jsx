import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/app";

function InterviewPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submittingQuestion, setSubmittingQuestion] = useState(null);
  const [completingInterview, setCompletingInterview] = useState(false);

  useEffect(() => {

    const fetchInterview = async () => {

      try {

        const response = await api.get(
          `/interviews/${id}`
        );

        let currentInterview = response.data.interview;

        // If no questions generated, generate them
        if (currentInterview.questions.length === 0) {

          const questionResponse = await api.post(
            `/interviews/${id}/generate-questions`
          );

          currentInterview = questionResponse.data.interview;

        }

        setInterview(currentInterview);
        setLoading(false);

      } catch (error) {

        console.error("Error fetching interview:", error);
        setLoading(false);

      }
    };

    fetchInterview();

  }, [id]);

  const submitAnswer = async (questionId) => {

    try {

      setSubmittingQuestion(questionId);

      await api.post(
        `/interviews/${id}/questions/${questionId}/answer`,
        {
          answer: answers[questionId]
        }
      );

      // Refetch interview to get updated feedback and score
      const response = await api.get(
        `/interviews/${id}`
      );

      setInterview(response.data.interview);
      setSubmittingQuestion(null);

    } catch (error) {

      console.error("Error submitting answer:", error);
      setSubmittingQuestion(null);

    }
  };

  const completeInterview = async () => {

    // Check if all questions are answered (answers are stored in answers state object)
    const unanswered = interview.questions.some(
      (q) => !answers[q._id]
    );

    if (unanswered) {

      alert("Please answer all questions before completing the interview");
      return;

    }

    try {

      setCompletingInterview(true);

      await api.post(
        `/interviews/${id}/complete`
      );

      navigate(`/results/${id}`);

    } catch (error) {

      console.error("Error completing interview:", error);
      alert("Error completing interview");
      setCompletingInterview(false);

    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!interview) {
    return <h1>Interview not found</h1>;
  }

  return (

    <div style={{ padding: "20px" }}>

      <h1>{interview.role}</h1>

      <p>Difficulty: {interview.difficulty}</p>

      <hr />

      {interview.questions && interview.questions.map((question, index) => (

        <div key={question._id} style={{ marginBottom: "30px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>

          <h3>Question {index + 1}</h3>

          <p style={{ fontSize: "18px", fontWeight: "500" }}>
            {question.question}
          </p>

          {/* If no answer yet, show textarea and submit button */}
          {!question.answer ? (

            <div>

              <textarea
                placeholder="Type your answer here..."
                value={answers[question._id] || ""}
                onChange={(e) => {
                  setAnswers({
                    ...answers,
                    [question._id]: e.target.value
                  });
                }}
                style={{
                  width: "100%",
                  height: "120px",
                  padding: "10px",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  borderRadius: "4px"
                }}
              />

              <br />
              <br />

              <button
                onClick={() => submitAnswer(question._id)}
                disabled={submittingQuestion === question._id || !answers[question._id]}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#181c1f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {submittingQuestion === question._id ? "Submitting..." : "Submit Answer"}
              </button>

            </div>

          ) : (

            // After answer submitted, show answer, feedback and score
            <div>

              <h4 style={{ color: "#666" }}>Your Answer:</h4>

              <p style={{ backgroundColor: "#e8f5e9", padding: "10px", borderRadius: "4px", color: "#0c0c0c", fontSize: "16px", lineHeight: "1.6" }}>
                {question.answer}
              </p>

              {question.feedback && (

                <div>

                  <h4 style={{ color: "#666" }}>Feedback:</h4>

                  <p style={{ backgroundColor: "#e8f5e9", padding: "10px", borderRadius: "4px", color: "#080908", fontSize: "16px", lineHeight: "1.6" }}>
                    {question.feedback}
                  </p>

                </div>

              )}

              {question.score !== undefined && (

                <div>

                  <h4 style={{ color: "#666" }}>Score:</h4>

                  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#007bff" }}>
                    {question.score}/10
                  </p>

                </div>

              )}

            </div>

          )}

        </div>

      ))}

      <hr />

      <button
        onClick={completeInterview}
        disabled={completingInterview}
        style={{
          padding: "12px 30px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          marginTop: "20px"
        }}
      >
        {completingInterview ? "Completing..." : "Complete Interview"}
      </button>

    </div>

  );
}

export default InterviewPage;