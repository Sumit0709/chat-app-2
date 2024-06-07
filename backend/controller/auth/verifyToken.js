const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {

    const token = req.cookies.token;
    if(!token)
        return res.status(401).json({
            success: false,
            error: 'Access Denied. No token provided'
        });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = decoded;
        next();
    } catch (err) {
        console.log("err", err);
        //Incase of expired jwt or invalid token kill the token and clear the cookie
        res.clearCookie("token");
        // return res.status(400).json({
        //     success: false,
        //     error: 'Access Denied!'
        // });
        next(err);
    }
}


module.exports = verifyToken;