const bcrypt = require("bcrypt");
const { uuid } = require('uuid4');
const mongoose = require('mongoose');

const User = require('../../module/User');
const FriendList = require("../../module/FriendList");
const uuid4 = require("uuid4");
const LastSeen = require("../../module/LastSeen");
const cachedLastSeen = require("../socket/cachedLastSeen");

const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789';



const register = async (req,res) => {

    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const password = req.body.password.trim();
    const email = req.body.email.toLowerCase();
    const mobile = req.body.mobile.toLowerCase();
    const name = req.body.name;

    // check if role is present and if present is it valid or not
    // if(req.body.role){
    // }
    
    
    User.findOne({mobile: mobile})
        .exec()
        .then(user => {
            if(user){
                return res.status(409).json({
                    success: false,
                    error: "User already exist",
                })
            }else{
                // user doesn't exist, so we can create new user
                bcrypt.hash(password,5,(err,hash)=>{
                    if(err){
                        // something went wrong while hashing password
                        console.log(err);
                        return res.status(500).json({
                            success: false,
                            error: "Something went wrong!"
                        })
                    }else{

                        const _id = new mongoose.Types.ObjectId()
                        const userId = uuid4();

                        const user = new User({
                            _id: _id,
                            email: email,
                            mobile: mobile,
                            password: hash,
                            name: name,
                            userId: userId
                        });

                        // create a friend list for the user
                        const friendList = new FriendList({
                            userId: _id,
                            mobile: mobile,
                            friends: []
                        })
                        friendList.save();
                        // console.log(user)

                        // saving user into database
                        user.save().then(result => {
                            if(result && result != null){
                                console.log("Registration Successful");
                                
                                const currTime = Date.now();
                                const lastSeen = new LastSeen({
                                    userId: userId,
                                    mobile: mobile,
                                    lastSeen: currTime
                                })
                                lastSeen.save()
                                cachedLastSeen.setLastSeen(mobile);
                                
                                
                                return res.status(200).json({
                                    success: true,
                                    // user: result,
                                    message: "Your Registration is successfull"
                                })
                            }
                            else{
                                return res.status(500).json({
                                    success: false,
                                    error: "Registration failed!"
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(500).json({
                                success: false,
                                error: "Something went wrong!"
                            })
                        })
                    }
                })
            }
        })
        .catch((err) => {
            console.log("User.findOne() failed")
            console.log(err);
            return res.status(500).json({
                success: false,
                error: err.message
            })
        })
// }
    
    
}

module.exports = register;