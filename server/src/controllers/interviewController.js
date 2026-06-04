const Interview = require("../models/Interview");
const { generateInterviewQuestions, evaluateAnswer, generateInterviewFeedback } = require("../services/geminiService");

const startInterview = async (req, res) => {
    try {

        const { role, difficulty } = req.body;

        if (!role || !difficulty) {
            return res.status(400).json({
                message: "Role and difficulty are required"
            });
        }

        const interview = await Interview.create({
            userId: req.user.userId,
            role,
            difficulty
        });

        return res.status(201).json({
            success: true,
            interview
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// get interview history
const getInterviewHistory = async (req, res) => {

    try {

        const interviews =
        await Interview.find({
            userId: req.user.userId
        })
        .sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            interviews
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const generateQuestions = async (req, res) => {

    try {

        const interview =
        await Interview.findById(
            req.params.id
        );

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }
        if (interview.questions.length > 0){
            return res.status(400).json({
                message: "Questions already generated"
            });
        }

        const questionsText = await generateInterviewQuestions(
            interview.role,
            interview.difficulty
        );

        // Parse JSON from markdown code block
        let questions = [];
        try {
            // Extract JSON from markdown code block (```json\n[...]\n```)
            const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not find JSON array in response");
            }
        } catch (parseError) {
            console.error("Failed to parse questions JSON", parseError);
            return res.status(500).json({
                message: "Failed to parse AI response"
            });
        }

        interview.questions = questions.map(question => ({
            question,
            answer:"",
            feedback:"",
            score: 0
        }));
        await interview.save();
        return res.status(200).json({
            success: true,
            interview
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// submit answer
const submitAnswer =
async (req, res) => {

    try {

        const { answer } = req.body;

        const {
            interviewId,
            questionId
        } = req.params;

        const interview =
        await Interview.findById(
            interviewId
        );

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        const question =
        interview.questions.id(
            questionId
        );

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        question.answer = answer;

        const evaluationText =
        await evaluateAnswer(
            question.question,
            answer
        );

        let evaluation = {};
        try {
            // Extract JSON object from markdown code block (```json\n{...}\n```)
            let cleanText = evaluationText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                evaluation = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not find JSON object in response");
            }
        } catch (parseError) {
            console.error("Failed to parse evaluation JSON", parseError);
            console.error("Raw evaluation response:", evaluationText);
            return res.status(500).json({
                message: "Failed to parse AI evaluation"
            });
        }
        question.feedback = evaluation.feedback;

        question.score = evaluation.score;

        await interview.save();

        return res.status(200).json({
            success: true,
            question
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const completeInterview = async (req, res) => {

    try {

        const interview =
        await Interview.findById(
            req.params.id
        );

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        const totalScore = interview.questions.reduce(
            (sum, question) =>
                sum + question.score,
            0
        );

        const averageScore = interview.questions.length
            ? totalScore /
              interview.questions.length
            : 0;

        interview.score =Number(
            averageScore.toFixed(1)
        );

        interview.isCompleted = true;

        await interview.save();

        const feedbackText =
        await generateInterviewFeedback(
            interview.questions
        );

        let parsedFeedback = {};
        try {
            // Remove markdown code block markers (```json and ```)
            let cleanText = feedbackText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
            
            // Extract JSON object
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedFeedback = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not find JSON object in response");
            }
        } catch (parseError) {
            console.error("Failed to parse feedback JSON:", parseError);
            console.error("Raw feedback response:", feedbackText);
            return res.status(500).json({
                message: "Failed to parse AI feedback",
                error: parseError.message
            });
        }

        interview.feedback = parsedFeedback.feedback;

        return res.status(200).json({
            success: true,
            interview
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};



module.exports = {
    startInterview,
    getInterviewHistory,
    generateQuestions,
    submitAnswer,
    completeInterview
};