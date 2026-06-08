const { GoogleGenAI } = require("@google/genai");

let ai = null;

const getAIClient = () => {
    if (!ai) {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }
    return ai;
};

const generateInterviewQuestions = async (role, difficulty) => {
    const aiClient = getAIClient();  // ✅ Initialize when needed
    
    const prompt = `
    Generate exactly 5 interview questions.

    Role: ${role}
    Difficulty: ${difficulty}

    Target Candidate:
    College Student
    Internship Candidate
    Entry Level Software Engineer

    Rules:

    1. Questions should be realistic placement interview questions.
    2. Mix fundamentals and practical questions.
    3. Do not ask architect-level questions.
    4. Keep each question under 30 words.
    5. Return ONLY a JSON array.

    Example:

    [
    "What is React?",
    "What is Virtual DOM?"
    ]
    `;

    let retries = 3;
    let lastError;

    while (retries > 0) {
        try {
            const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });

            return response.text;
        } catch (error) {
            lastError = error;
            if (error.status === 503) {
                retries--;
                if (retries > 0) {
                    console.log(`API temporarily unavailable (503). Retrying... (${retries} attempts left)`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                } else {
                    console.error("API service still unavailable after retries");
                    throw new Error("Gemini API temporarily unavailable. Please try again in a moment.");
                }
            } else {
                throw error;
            }
        }
    }

    throw lastError;
};

const evaluateAnswer = async (
    question,
    answer
    ) => {
        const aiClient = getAIClient();

        const prompt = `
        You are a technical interviewer.

        Question:
        ${question}

        Candidate Answer:
        ${answer}

        Evaluate the answer.

        Return ONLY JSON in this format:

        {
        "score": 8,
        "feedback": "Good explanation..."
        }

        Score should be between 0 and 10.
        `;

        let retries = 3;
        let lastError;

        while (retries > 0) {
            try {
                const response = await aiClient.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt
                });
                return response.text;
            } catch (error) {
                lastError = error;
                if (error.status === 503) {
                    retries--;
                    if (retries > 0) {
                        console.log(`API temporarily unavailable (503). Retrying... (${retries} attempts left)`);
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                    } else {
                        console.error("API service still unavailable after retries");
                        throw new Error("Gemini API temporarily unavailable. Please try again in a moment.");
                    }
                } else {
                    throw error;
                }
            }
        }

        throw lastError;
};

const generateInterviewFeedback = async (questions) => {

    const summary = questions.map(q => ({
        question: q.question,
        answer: q.answer || "Not answered",
        score: q.score
    }));
    const aiClient = getAIClient();
    const prompt = `
    You are an experienced technical interviewer.

    Based on these interview results:

    ${JSON.stringify(summary, null, 2)}

    Analyze the candidate's performance and provide a comprehensive assessment with:

    1. Strengths (at least 2-3 key strengths observed, even if partial answers)
    2. Weaknesses (at least 2-3 areas for improvement, including unanswered topics)
    3. Recommendations (at least 2-3 actionable recommendations for improvement)

    Return ONLY this JSON format (no markdown, no code blocks):

    {
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
    }
    `;

    let retries = 3;
    let lastError;

    while (retries > 0) {
        try {
            const response =
            await aiClient.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });

            return response.text;
        } catch (error) {
            lastError = error;
            if (error.status === 503) {
                retries--;
                if (retries > 0) {
                    console.log(`API temporarily unavailable (503). Retrying feedback generation... (${retries} attempts left)`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                } else {
                    console.error("API service still unavailable after retries for feedback");
                    throw new Error("Gemini API temporarily unavailable. Please try again in a moment.");
                }
            } else {
                throw error;
            }
        }
    }

    throw lastError;
};

module.exports = {
    generateInterviewQuestions,
    evaluateAnswer,
    generateInterviewFeedback
};