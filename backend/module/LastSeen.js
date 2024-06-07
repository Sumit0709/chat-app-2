const mongoose = require("mongoose");

const lastSeenSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    lastSeen: {
        type: Number,
        required: true
    }

}, {timestamps: true});

module.exports = mongoose.model("LastSeen", lastSeenSchema);