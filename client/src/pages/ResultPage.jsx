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
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📊</div>
          <h1>Loading results...</h1>
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

  const getScoreColor = (score) => {
    if (score >= 8) return "#10b981";
    if (score >= 6) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreGradient = (score) => {
    if (score >= 8) return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    if (score >= 6) return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
    return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Overall Score Card */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            marginBottom: "40px",
            overflow: "hidden",
          }}
        >
          <div style={{
            background: getScoreGradient(interview.score),
            color: "white",
            padding: "40px",
            textAlign: "center",
          }}>
            <h1 style={{ fontSize: "40px", fontWeight: "800", margin: "0 0 20px 0" }}>
              🎉 Interview Complete!
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.9)", margin: "0 0 30px 0" }}>
              {interview.role} • {interview.difficulty}
            </p>
            <div style={{
              fontSize: "72px",
              fontWeight: "800",
              marginBottom: "10px",
            }}>
              {interview.score.toFixed(1)}
            </div>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.9)", margin: 0 }}>
              out of 10
            </p>
          </div>

          {/* Score Breakdown */}
          <div style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginTop: 0, marginBottom: "24px" }}>
              📈 Your Performance
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}>
              <div style={performanceCard}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>❓</div>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 4px 0", fontWeight: "600" }}>Total Questions</p>
                <p style={{ fontSize: "28px", fontWeight: "800", color: "#667eea", margin: 0 }}>
                  {interview.questions.length}
                </p>
              </div>
              <div style={performanceCard}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 4px 0", fontWeight: "600" }}>Answered</p>
                <p style={{ fontSize: "28px", fontWeight: "800", color: "#10b981", margin: 0 }}>
                  {interview.questions.filter(q => q.answer).length}
                </p>
              </div>
              <div style={performanceCard}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>⭐</div>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 4px 0", fontWeight: "600" }}>Average Question Score</p>
                <p style={{ fontSize: "28px", fontWeight: "800", color: "#f59e0b", margin: 0 }}>
                  {interview.questions.length > 0
                    ? (interview.questions.reduce((sum, q) => sum + (q.score || 0), 0) / interview.questions.length).toFixed(1)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Card */}
        {interview.feedback ? (
          <div style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            marginBottom: "40px",
            overflow: "hidden",
          }}>
            <div style={{ padding: "40px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginTop: 0, marginBottom: "30px" }}>
                💬 AI Feedback
              </h2>

              {/* Strengths */}
              <div style={{ marginBottom: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ fontSize: "24px", marginRight: "12px" }}>💪</div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#10b981" }}>Strengths</h3>
                </div>
                {interview.feedback.strengths && interview.feedback.strengths.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "32px", color: "#374151", lineHeight: "1.8" }}>
                    {interview.feedback.strengths.map((strength, idx) => (
                      <li key={idx} style={{ marginBottom: "8px" }}>{strength}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>No strengths recorded</p>
                )}
              </div>

              {/* Weaknesses */}
              <div style={{ marginBottom: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ fontSize: "24px", marginRight: "12px" }}>📍</div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#ef4444" }}>Areas for Improvement</h3>
                </div>
                {interview.feedback.weaknesses && interview.feedback.weaknesses.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "32px", color: "#374151", lineHeight: "1.8" }}>
                    {interview.feedback.weaknesses.map((weakness, idx) => (
                      <li key={idx} style={{ marginBottom: "8px" }}>{weakness}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>No weaknesses recorded</p>
                )}
              </div>

              {/* Recommendations */}
              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ fontSize: "24px", marginRight: "12px" }}>🎯</div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#f59e0b" }}>Recommendations</h3>
                </div>
                {interview.feedback.recommendations && interview.feedback.recommendations.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "32px", color: "#374151", lineHeight: "1.8" }}>
                    {interview.feedback.recommendations.map((rec, idx) => (
                      <li key={idx} style={{ marginBottom: "8px" }}>{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>No recommendations recorded</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            marginBottom: "40px",
            padding: "40px",
            textAlign: "center",
            color: "#6b7280",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
            <p>AI feedback is being generated. Please check back in a moment or refresh the page.</p>
          </div>
        )}

        {/* Question Details */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          marginBottom: "40px",
          overflow: "hidden",
        }}>
          <div style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginTop: 0, marginBottom: "30px" }}>
              📋 Detailed Analysis
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}>
              {interview.questions && interview.questions.map((question, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{
                    background: `linear-gradient(135deg, ${getScoreColor(question.score)} 0%, ${getScoreColor(question.score)}dd 100%)`,
                    color: "white",
                    padding: "16px",
                  }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", opacity: 0.9 }}>
                      Question {idx + 1}
                    </h4>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", lineHeight: "1.4" }}>
                      {question.question}
                    </p>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Your Answer</p>
                      <p style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#374151",
                        lineHeight: "1.5",
                        maxHeight: "100px",
                        overflow: "hidden",
                      }}>
                        {question.answer || "No answer provided"}
                      </p>
                    </div>
                    {question.feedback && (
                      <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Feedback</p>
                        <p style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: "1.5",
                          maxHeight: "100px",
                          overflow: "hidden",
                        }}>
                          {question.feedback}
                        </p>
                      </div>
                    )}
                    <div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>Score</p>
                      <p style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: getScoreColor(question.score) }}>
                        {question.score}/10
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          marginBottom: "40px",
        }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "14px 32px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "2px solid white",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
            }}
          >
            🎯 Practice Another Interview
          </button>
        </div>
      </div>
    </div>
  );
}

const performanceCard = {
  background: "#f9fafb",
  padding: "20px",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  textAlign: "center",
};

export default ResultPage;
