const FriendList = require('../../module/FriendList')


const getFriendList = async(mobile) => {

    return FriendList.findOne({mobile: mobile}).exec()
        .then(res => {
            if(res){
                return {
                    success: true,
                    list: res.friends
                }
            }
            else{
                return {
                    success: false,
                    error: "Friend's list not found!"
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

module.exports = getFriendList