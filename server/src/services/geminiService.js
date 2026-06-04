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

    const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;
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

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
    });

    return response.text;
};

const generateInterviewFeedback = async (questions) => {

    const summary = questions.map(q => ({
        question: q.question,
        answer: q.answer,
        score: q.score
    }));
    const aiClient = getAIClient();
    const prompt = `
    You are an experienced technical interviewer.

    Based on these interview results:

    ${JSON.stringify(summary)}

    Provide a comprehensive assessment with:

    1. Strengths (array of key strengths)
    2. Weaknesses (array of areas for improvement)
    3. Recommendations (array of actionable recommendations)

    Return ONLY JSON in this exact format:

    {
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "recommendations": ["recommendation 1", "recommendation 2"]
    }
    `;

    const response =
    await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;
};

module.exports = {
    generateInterviewQuestions,
    evaluateAnswer,
    generateInterviewFeedback
};