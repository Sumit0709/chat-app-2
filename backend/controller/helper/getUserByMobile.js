const User = require("../../module/User")


const getUserByMobile = async(mobile) => {

    return User.findOne({mobile: mobile}).exec()
    .then(res => {
        if(res){
            res.password = undefined
            return {
                success: true,
                user: res
            }
        }
        else{
            return {
                success: false,
                error: "User not found!"
            }
        }
    })
    .catch(err => {
        return {
            success: false,
            error: err,
            catch: true
        }
    }) 
}

module.exports = getUserByMobile;