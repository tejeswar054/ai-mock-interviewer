const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        default: ""
    },

    feedback: {
        type: String,
        default: ""
    },

    score: {
        type: Number,
        default: 0
    }

});

const interviewSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    role: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: [
            "Easy",
            "Medium",
            "Hard"
        ],
        required: true
    },

    score: {
        type: Number,
        default: 0
    },

    feedback: {
        type: String,
        default: ""
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    questions: {
        type: [questionSchema],
        default: []
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model(
    "Interview",
    interviewSchema
);