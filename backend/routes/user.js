const express = require('express');

const verifyToken = require('../controller/auth/verifyToken');
const logErrors = require('../controller/middleware/errorHandler.js/logErrors');
const errorResponse = require('../controller/middleware/errorHandler.js/errorResponse');
const getUser = require('../controller/middleware/getUser');
const addFriend = require('../controller/user/addFriend');
const getFriends = require('../controller/user/getFriends');
const sendFriendRequest = require('../controller/user/sendFriendRequest');
const router = express.Router();


router.post('/add_friend', verifyToken, getUser, addFriend, logErrors, errorResponse);
router.get('/get_friend', verifyToken, getUser, getFriends, logErrors, errorResponse);

router.post('/send_friend_request', verifyToken, getUser, sendFriendRequest, logErrors, errorResponse);

module.exports = router;