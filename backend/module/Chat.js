const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const individualChatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sent: {
        type: Number,
        required: true
    },
    received: {
        type: Number,
        required: false
    },
    seen: {
        type: Number,
        required: false
    },
}, {timestamps: true});

const eachUserChatSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true
    },
    chat: [individualChatSchema]
}, {timestamps: true});

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    chats: [eachUserChatSchema]
})

chatSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Chat", chatSchema);