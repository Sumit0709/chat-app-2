const { getLastSeen_Api } = require("../../externalApi.js/lastSeen");
const cachedLastSeen = require("../cachedLastSeen");

const logError = require("../LOG/logError");

const path = require('path');
const currentFileName = path.basename(__filename);

const getLastSeenOfAllFriends = async (socket) => {

    try{
        let friends = socket.friends;
            
        if(!friends){ // REFRESH FRIENDS LIST
            await setFriendsList(socket);
            friends = socket.friends;
        }

        const friends_mobiles = []
        for(let mobile of friends.keys()){
            friends_mobiles.push(parseInt(mobile));
            // const lastSeen = await new Promise((resolve, reject) => {
            //     cachedLastSeen.getLastSeen(mobile)
            //         .then(res => {
            //             if(res.success){
            //                 resolve(res.lastSeen);
            //             }
            //             else{
            //                 resolve(null);
            //             }
            //         })
            //         .catch(err => {
            //             reject(err)
            //         })
                
            // })
            // // console.log(lastSeen);
            // if(lastSeen){
            //     response.push({mobile, lastSeen})
            // }
        }
        // console.log(response)
        if(friends_mobiles.length > 0){
            const response = await getLastSeen_Api(friends_mobiles)
            socket.emit('set_last_seen', response);
        }
    }
    catch(err){
        logError(currentFileName, err)
    }

}

module.exports = getLastSeenOfAllFriends;