const jwt = require("jsonwebtoken");


const path = require('path');
const logError = require("./LOG/logError");
const currentFileName = path.basename(__filename);

const verifyTokenInSocket = async (cookie) => {

    const token = cookie.token;
    if(!token)
        return {
            success: false,
            error: 'Access Denied. No token provided'
        };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            success: true,
            data: decoded
        }
    } catch (err) {
        logError(currentFileName, err)
        //Incase of expired jwt or invalid token kill the token and clear the cookie
        return {
            success: false,
            error: err,
            expired: true
        }
    }
}


module.exports = verifyTokenInSocket;