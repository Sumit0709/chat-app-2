const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    mobile: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    sessionId: {
        type: String,
        unique: false
    },
    userId: {
        type: String,
        required: true
    }

}, {timestamps: true});

userSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("User", userSchema);