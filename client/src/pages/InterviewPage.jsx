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

    // Check if all questions are answered (check actual submitted answers in interview data)
    const unanswered = interview.questions.some(
      (q) => !q.answer
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
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          <h1>Loading Interview...</h1>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
          <h1>Interview not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px", color: "white" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "800", margin: "0 0 10px 0" }}>
            {interview.role}
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.9)", margin: 0 }}>
            Difficulty: <span style={{ fontWeight: "600" }}>{interview.difficulty}</span> • Questions: <span style={{ fontWeight: "600" }}>{interview.questions.length}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            height: "8px",
            overflow: "hidden",
          }}>
            <div style={{
              background: "white",
              height: "100%",
              width: `${interview.questions.length > 0 ? (interview.questions.filter(q => q.answer).length / interview.questions.length) * 100 : 0}%`,
              transition: "width 0.3s ease",
            }} />
          </div>
          <p style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "14px",
            marginTop: "10px",
            margin: "10px 0 0 0",
          }}>
            {interview.questions.filter(q => q.answer).length}/{interview.questions.length} Answered
          </p>
        </div>

        {/* Questions */}
        <div>
          {interview.questions && interview.questions.map((question, index) => (
            <div key={question._id} style={{
              background: "white",
              marginBottom: "24px",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
            }}>
              {/* Question Header */}
              <div style={{
                background: `linear-gradient(135deg, ${question.answer ? "#10b981" : "#667eea"} 0%, ${question.answer ? "#059669" : "#764ba2"} 100%)`,
                color: "white",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", opacity: 0.9, marginBottom: "8px" }}>
                    Question {index + 1} of {interview.questions.length}
                  </div>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                    {question.question}
                  </h3>
                </div>
                <div style={{ fontSize: "36px" }}>
                  {question.answer ? "✅" : "⏳"}
                </div>
              </div>

              {/* Question Body */}
              <div style={{ padding: "24px" }}>
                {!question.answer ? (
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "12px",
                    }}>
                      Your Answer
                    </label>
                    <textarea
                      placeholder="Type your answer here... Think carefully and provide a detailed response."
                      value={answers[question._id] || ""}
                      onChange={(e) => {
                        setAnswers({
                          ...answers,
                          [question._id]: e.target.value
                        });
                      }}
                      style={{
                        width: "100%",
                        height: "150px",
                        padding: "14px",
                        fontFamily: "'Segoe UI', sans-serif",
                        fontSize: "15px",
                        borderRadius: "10px",
                        border: "1.5px solid #e5e7eb",
                        boxSizing: "border-box",
                        resize: "none",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                    />

                    <button
                      onClick={() => submitAnswer(question._id)}
                      disabled={submittingQuestion === question._id || !answers[question._id]}
                      style={{
                        marginTop: "16px",
                        padding: "12px 28px",
                        background: submittingQuestion === question._id || !answers[question._id] ? "#cbd5e1" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: submittingQuestion === question._id || !answers[question._id] ? "not-allowed" : "pointer",
                        fontSize: "15px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                      }}
                    >
                      {submittingQuestion === question._id ? "Submitting..." : "Submit Answer"}
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Answer */}
                    <div style={{ marginBottom: "24px" }}>
                      <label style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "12px",
                      }}>
                        ✓ Your Answer
                      </label>
                      <div style={{
                        background: "#f3f4f6",
                        padding: "14px",
                        borderRadius: "10px",
                        color: "#1f2937",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        borderLeft: "4px solid #10b981",
                      }}>
                        {question.answer}
                      </div>
                    </div>

                    {/* Feedback */}
                    {question.feedback && (
                      <div style={{ marginBottom: "24px" }}>
                        <label style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "12px",
                        }}>
                          💡 AI Feedback
                        </label>
                        <div style={{
                          background: "#f0fdf4",
                          padding: "14px",
                          borderRadius: "10px",
                          color: "#166534",
                          fontSize: "15px",
                          lineHeight: "1.6",
                          borderLeft: "4px solid #22c55e",
                        }}>
                          {question.feedback}
                        </div>
                      </div>
                    )}

                    {/* Score */}
                    {question.score !== undefined && (
                      <div>
                        <label style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "12px",
                        }}>
                          ⭐ Score
                        </label>
                        <div style={{
                          background: "#eff6ff",
                          padding: "14px",
                          borderRadius: "10px",
                          color: "#1e40af",
                          fontSize: "18px",
                          fontWeight: "700",
                          borderLeft: "4px solid #3b82f6",
                        }}>
                          {question.score}/10
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Complete Button */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "40px", marginBottom: "40px" }}>
          <button
            onClick={completeInterview}
            disabled={completingInterview || interview.questions.some(q => !q.answer)}
            style={{
              padding: "14px 40px",
              background: completingInterview || interview.questions.some(q => !q.answer) ? "rgba(255, 255, 255, 0.3)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: completingInterview || interview.questions.some(q => !q.answer) ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
            }}
          >
            {completingInterview ? "Completing..." : "Complete Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default InterviewPage;