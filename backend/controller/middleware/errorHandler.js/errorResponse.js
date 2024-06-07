
const errorResponse = async(err, req, res, next) => {

    return res.status(500).json({
        success: false,
        error: "Something went wrong!"
    })

}

module.exports = errorResponse