

const logErrors = async(err, req, res, next) => {

    console.log("INSIDE LOG ERROR");
    console.error(err.stack)
    next(err);
}

module.exports = logErrors