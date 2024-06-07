const jwt = require("jsonwebtoken");

const status = async (req, res) => {

    return res.status(200).json({
        success: true,
        mobile: req.decoded.mobile
    });
}


module.exports = status;