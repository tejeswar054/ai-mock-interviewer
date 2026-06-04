import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/app";

function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${id}`);
        setInterview(response.data.interview);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching interview:", error);
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading results...</div>;
  }

  if (!interview) {
    return (
      <div style={{ padding: "20px", color: "#dc3545" }}>
        Interview not found
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1>Interview Results</h1>

      {/* Overall Score */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          textAlign: "center",
          border: "1px solid #dee2e6"
        }}
      >
        <h2 style={{ color: "#007bff", margin: "0 0 10px 0" }}>
          Overall Score
        </h2>
        <div style={{ fontSize: "48px", fontWeight: "bold", color: "#007bff" }}>
          {interview.score}/10
        </div>
        <p style={{ margin: "10px 0 0 0", color: "#6c757d" }}>
          Role: {interview.role} | Difficulty: {interview.difficulty}
        </p>
      </div>

      {/* Overall Feedback */}
      {interview.feedback && (
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6"
          }}
        >
          <h3 style={{ color: "#28a745", marginTop: "0" }}>Strengths</h3>
          <ul style={{ color: "#333", lineHeight: "1.8" }}>
            {interview.feedback.strengths && interview.feedback.strengths.length > 0 ? (
              interview.feedback.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))
            ) : (
              <li>No strengths recorded</li>
            )}
          </ul>

          <h3 style={{ color: "#dc3545" }}>Areas for Improvement</h3>
          <ul style={{ color: "#333", lineHeight: "1.8" }}>
            {interview.feedback.weaknesses && interview.feedback.weaknesses.length > 0 ? (
              interview.feedback.weaknesses.map((weakness, idx) => (
                <li key={idx}>{weakness}</li>
              ))
            ) : (
              <li>No weaknesses recorded</li>
            )}
          </ul>

          <h3 style={{ color: "#ff9800" }}>Recommendations</h3>
          <ul style={{ color: "#333", lineHeight: "1.8" }}>
            {interview.feedback.recommendations && interview.feedback.recommendations.length > 0 ? (
              interview.feedback.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))
            ) : (
              <li>No recommendations recorded</li>
            )}
          </ul>
        </div>
      )}

      {/* Question Details */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Question-by-Question Analysis</h3>
        {interview.questions && interview.questions.map((question, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #dee2e6"
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#333" }}>
                Question {idx + 1}: {question.question}
              </strong>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#666" }}>Your Answer:</strong>
              <p
                style={{
                  color: "#333",
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "5px"
                }}
              >
                {question.answer || "No answer provided"}
              </p>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#666" }}>AI Feedback:</strong>
              <p
                style={{
                  color: "#2e7d32",
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "5px"
                }}
              >
                {question.feedback || "No feedback available"}
              </p>
            </div>

            <div>
              <strong style={{ color: "#007bff" }}>
                Score: {question.score}/10
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "30px"
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 30px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 30px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Take Another Interview
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
