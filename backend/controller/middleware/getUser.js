const User = require("../../module/User");

const defaultError = {
    success: false,
    error: "Can not find User!"
}

const getUser = async (req, res, next) => {

    const userId = req.decoded._id;
    
    User.findById(userId).exec()
        .then(user =>{
            if(user){
                req.user = user;
                next();
            }
            else{
                return res.status(404).json(defaultError)
            }
        })
        .catch(err => {
            next(err);
        })

}

module.exports = getUser;