const getFriendList = require("../helper/getFriendList");
const setFriendList = require("../helper/setFriendList");


const getFriends = async(req, res, next) => {
    try{
        const myMobile = req.user.mobile

        const response = await getFriendList(myMobile)

        if(response.success){
            return res.status(200).json({
                success: true
            })
        }else{
            if(response.catch){
                next(response.error)
            }
            else{
                return res.status(404).json(response)
            }
        }
    }
    catch(err){
        next(err);
    }
    
}

module.exports = getFriends