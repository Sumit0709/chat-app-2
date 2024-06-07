const uuid4 = require("uuid4");
const FriendList = require("../../module/FriendList");
const getUserByMobile = require("../helper/getUserByMobile");
const setFriendList = require("../helper/setFriendList");

const fs = require('fs');
const path = require('path');

const sendFriendRequest = async(req, res, next) => {

    const myMobile = req.user.mobile
    const friendsMobile = req.body.friendsMobile;
    const friendsName = req.body.friendsName;
    // const user = req.user;

    const friend = await getUserByMobile(friendsMobile);
    if(friend.success){

        try{
            // const friendsMobile = req.body.friendsMobile;
            const chat_id = uuid4()
            const currTime = Date.now();

            const myFriendDoc = await FriendList.findOne({mobile: myMobile}).exec();
            if(!myFriendDoc){
                return res.status(505).json({
                    success: false,
                    error: "Something went wrong while fetching friend's list! Please contact admin."
                })
            }
            // console.log(friend.user.userId);
            for(let f of myFriendDoc?.friends){
                // console.log(f.userId);
                // console.log("*******");
                if(f.userId == friend.user.userId){
                    return res.status(200).json({
                        success: true,
                        message: "Already a Friend!"
                    })
                }
            }

            const newFriendSender = {mobile: friendsMobile, name: friend.user.name, customName: friendsName, status: 2, chatId: chat_id, friendSince: currTime, userId: friend.user.userId}
            const newFriendReceiver = {mobile: myMobile, name: req.user.name, status: 2, chatId: chat_id, friendSince: currTime, userId: req.user.userId}
            
            
            const receiver = await FriendList.findOneAndUpdate({mobile: friendsMobile}, {$push: { friends: newFriendReceiver }}, {new: true, upsert: true}).exec();
            if(!receiver){
                return res.status(505).json({
                    success: false,
                    error: "Friend Request Not Sent"
                })
            }

            const sender = await FriendList.findOneAndUpdate({mobile: myMobile}, {$push: { friends: newFriendSender }}, {new: true, upsert: true}).exec();
            if(!sender){
                const logOperation = `await FriendList.findOneAndUpdate({mobile: myMobile}, {$push: { friends: newFriendSender }}, {new: true, upsert: true}).exec(); {
                    myMobile: ${myMobile},
                    newFriendSender: ${newFriendSender}
                }`
                fs.appendFile(path.join(__dirname, 'incompleteFriendRequest.log'), logOperation, (err) => {
                    console.log("ERROR IN LOGGING FAILED FRIEND REQUEST")
                })
                return res.status(505).json({
                    success: false,
                    error: "Something went wrong while sending Friend Request!"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Friend added successfully"
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

module.exports = sendFriendRequest