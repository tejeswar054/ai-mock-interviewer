const express = require("express");
const protect = require("../middleware/authMiddleware");
const { startInterview, getInterviewHistory, generateQuestions } = require("../controllers/interviewController");
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
module.exports = router;