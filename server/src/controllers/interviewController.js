const Interview = require("../models/Interview");
const { generateInterviewQuestions } = require("../services/geminiService");

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

module.exports = {
    startInterview,
    getInterviewHistory,
    generateQuestions
};