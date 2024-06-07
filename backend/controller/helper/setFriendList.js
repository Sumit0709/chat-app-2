const FriendList = require('../../module/FriendList')


const setFriendList = async(myMobile, friendsMobile, friendsName) => {

    const newFriend = { mobile: friendsMobile, name: friendsName };

    try{
        const friendsDoc = await FriendList.findOne({mobile: myMobile}).exec();
        const friends = friendsDoc.friends
        let n = friends.length;

        const foundFriend = friends.find((friend) => friend.mobile == friendsMobile);
        if(foundFriend){
            return {
                success: true,
                list: friends
            }
        }

        return FriendList.findOneAndUpdate({mobile: myMobile}, {$push: { friends: newFriend }}, {new: true, upsert: true}).exec()
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
                    error: "Friend's list not found!",
                    catch: false
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
    catch(err){
        return {
            success: false,
            error: err,
            catch: true
        }
    }
    

}

module.exports = setFriendList