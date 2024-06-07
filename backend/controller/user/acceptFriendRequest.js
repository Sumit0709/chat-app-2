const FriendList = require("../../module/FriendList");
const getUserByMobile = require("../helper/getUserByMobile");
const setFriendList = require("../helper/setFriendList");


const acceptFriendRequest = async(req, res, next) => {

    const myMobile = req.user.mobile
    const friendsMobile = req.body.friendsMobile;

    // const user = req.user;

    const friend = await getUserByMobile(friendsMobile);
    if(friend.success){

        try{
            // const friendsMobile = req.body.friendsMobile;
            const status = req.body.status;
            const newFriendSender = {mobile: friendsMobile, name: friend.user.name, customName: friendsName, status: status}
            const newFriendReceiver = {mobile: myMobile, name: req.user.name, status: status}
            
            
            const receiver = await FriendList.findOneAndUpdate({mobile: friendsMobile}, {$push: { friends: newFriendReceiver }}, {new: true, upsert: true}).exec();
            if(!receiver){
                return res.status(505).json({
                    success: false,
                    error: "Friend Request Not Sent"
                })
            }

            const sender = await FriendList.findOneAndUpdate({mobile: myMobile}, {$push: { friends: newFriendSender }}, {new: true, upsert: true}).exec();
            if(!sender){
                return res.status(505).json({
                    success: false,
                    error: "Something went wrong while sending Friend Request!"
                })
            }

            return res.status(200).json({
                success: true
            })
            
        }
        catch(err){
            next(err);
        }

    }
    else{
        if(friend.catch){
            next(friend.error)
        }
        else{
            return res.status(201).json({
                success: false,
                error: "User is not using our service now, Please invite them."
            })
        }
    }

}

module.exports = acceptFriendRequest