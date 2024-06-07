

const logout = async(req, res, next) => {

    res.clearCookie("token");
    return res.status(200).json({
        success: true
    })

}

module.exports = logout;