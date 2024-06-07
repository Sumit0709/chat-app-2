const mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate-v2');

const friendsSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    customName: {
        type: String,
        required: false,
        default: "",
    },
    status: {
        type: Number, // 0-> friend request sent, 1-> friend req received, 2-> friend req accepted, 3-> friend req rejected 
    },
    friendSince: {
        type: Number
    },
    chatId: {
        type: String
    },
    userId: {
        type: String
    }
}, {timestamps: true});

const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    user_id_for_chat: {
        type: String
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    friends: [friendsSchema]
})

module.exports = mongoose.model("FriendList", friendSchema);