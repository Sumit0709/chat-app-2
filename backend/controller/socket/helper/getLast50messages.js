const cassandra = require("../../../cassandra");
const logError = require("../LOG/logError");

const path = require('path');
const currentFileName = path.basename(__filename);

const last50messages = async (socket) => {

    try{
        let client = cassandra.getClient();
        if(!client){

            client = cassandra.connectClient()
            if(!client){
                socket.emit('error', {action: 'chat_history', error: `Can't read message, something went wrong!`});
                logError(currentFileName,"Cassandra Client not Found!");
                console.error("last50messages 'Client not Found!' 404")
                return;
            }
        }
        const friends = socket.friends;
        const chatHistory = new Map();
        const limit = 50
        if(friends.length == 0){
            console.log("last50messages 'Friends List is empty' 200")
            return;
        }
        
        for(const[key, value] of friends){
            // console.log(key)
            // console.log(value)

            let currFriendChat = await new Promise((resolve, reject) => {
                const data = [];
                
                client.execute(`SELECT sender, receiver, message_id, message, type, preview, sent_at, received_at, seen_at, sequence FROM ${process.env.PRIVATE_CHAT_CASSANDRA_TABLE} WHERE chat_id=? LIMIT ?`,[value.chatId, limit], {prepare: true})
                    .then(res => {
                        resolve(res.rows)
                    })
                    .catch(err => {
                        reject(err);
                    })
            });

            chatHistory.set(key, currFriendChat);
        }

        socket.emit('chat_history', Array.from(chatHistory))
    }
    catch(err){
        logError(currentFileName, err)
    }

}

module.exports = last50messages;