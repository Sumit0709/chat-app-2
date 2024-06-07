const express = require('express');
const register = require('../controller/auth/register');
const login = require('../controller/auth/login');
const verifyToken = require('../controller/auth/verifyToken');
const status = require('../controller/auth/status');
const logErrors = require('../controller/middleware/errorHandler.js/logErrors');
const errorResponse = require('../controller/middleware/errorHandler.js/errorResponse');
const logout = require('../controller/auth/logout');
const router = express.Router();    

// To check if user is logged in or not
router.get('/status', verifyToken, status, logErrors, errorResponse);

router.post('/register', register, logErrors, errorResponse)
router.post('/login', login, logErrors, errorResponse)
router.get('/logout', logout)

module.exports = router;