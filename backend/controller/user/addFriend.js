const setFriendList = require("../helper/setFriendList");


const addFriend = async(req, res, next) => {
    try{
        const myMobile = req.user.mobile
        const friendsMobile = req.body.friendsMobile;
        const friendsName = req.body.friendsName;


        const response = await setFriendList(myMobile, friendsMobile, friendsName)

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

module.exports = addFriend