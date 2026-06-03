const express = require("express");
const protect = require("../middleware/authMiddleware");
const { startInterview, getInterviewHistory, generateQuestions, submitAnswer } = require("../controllers/interviewController");
const { route } = require("./authRoutes");
const router = express.Router();

router.post(
    "/start",
    protect,
    startInterview
);
router.get(
    "/history",
    protect,
    getInterviewHistory
);
router.post(
    "/:id/generate-questions",
    protect,
    generateQuestions
);
router.post(
    "/:interviewId/questions/:questionId/answer",
    protect,
    submitAnswer
)
module.exports = router;