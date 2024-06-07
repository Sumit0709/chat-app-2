const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../module/User");
const uuid4 = require("uuid4");
const LastSeen = require("../../module/LastSeen");
const cachedLastSeen = require("../socket/cachedLastSeen");

const signinError = {
    success: false,
    error: "Mobile number or password is incorrect!"
}

const login = async (req, res) => {

    try{
        const mobile = req.body.mobile;
        const password = req.body.password;
        
        const user = await User.findOne({mobile: mobile}).exec();

        if(!user){
            return res.status(401).json(signinError)
        }

        bcrypt.compare(password, user.password, (err, match)=> {
            if(err){
                res.status(500).json({
                    success: false,
                    error: "Internal Server Error!"
                })
            }
            else if(!match){
                res.status(401).json(signinError)
            }
            else{

                const sessionId = uuid4();

                // update session Id in DB
                User.findByIdAndUpdate(user._id, {
                    sessionId: sessionId
                })

                const token = jwt.sign({
                    mobile: user.mobile,
                    sessionId: sessionId,
                    userId: user.userId,
                    _id: user._id,
                    createdAt: user.createdAt
                },process.env.JWT_SECRET);

                res.cookie('token', token, {
                    httpOnly: true, // The cookie is accessible only through HTTP(S) and not by JavaScript
                    // maxAge: 3600000, // Optional: Set the cookie expiration time in milliseconds (1 hour in this example)
                    // sameSite: 'None',
                });

                cachedLastSeen.setLastSeen(mobile);

                return res.status(200).json({
                    success: true,
                    sessionId: sessionId,
                    message: "Successfully signed in",
                    userId: user.userId
                })
            }
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

module.exports = login