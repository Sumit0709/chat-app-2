const cassandra = require('../../../cassandra');
const { emitEvent_Api } = require('../../externalApi.js/emitEvent');
const cachedSocket = require('../cachedSocket');
const setFriendsList = require('./setFriendsList');

const logError = require("../LOG/logError");

const path = require('path');
const currentFileName = path.basename(__filename);

const emitMessage = async (data) => {
    const eventName = 'notifying_private_message_received_to_sender';
    const mobile = data.sender;

    emitEvent_Api(eventName, data, mobile);
    // io.to(senderSocketId).emit("notifying_private_message_received_to_sender", data)
}


const notifyPrivateMessageReceived = async(io, socket, data) => {
    try{
        let client = cassandra.getClient();
        if(!client){
            client = cassandra.connectClient()
            if(!client){
                logError(currentFileName,"Cassandra Client not Found!");
                socket.emit('error', {action: 'notifying_private_message_received', error: `Can't send message, something went wrong!`, data: data});
                return;
            }
        }

        let currFriend = socket.friends.get(parseInt(data.sender));
        // currfriender is the sender of this message
        
        if(!currFriend){ // REFRESH FRIENDS LIST
            await setFriendsList(socket);
            currFriend = socket.friends.get(parseInt(data.sender));
        }

        // THE TWO USERS ARE NOT FRIENDS OR chatId is empty, emit error
        if(!currFriend || !currFriend.chatId){ 
            logError(currentFileName,"Reason :: !currFriend || !currFriend.chatId");
            socket.emit('error', {action: 'notifying_private_message_received', error: `Can't send message, something went wrong!`, data: data});
            return;
        }

        const chat_id = currFriend.chatId
        const sender_user_id = currFriend.userId

        data.received_at = new Date()
        const {sender, receiver, message, message_id, type, preview, sent_at, received_at, sequence} = data


        // Get Socket ID of the sender
        // const senderSocketId = (await cachedSocket.getSocket(data.sender)).socketId;

        // if(senderSocketId){
        // }

        // Update received_at time in private_chat and delete the data from pending
        const un_received_message_service_type = 0;
        const timestamp = Date.now();
        
        client.execute(`UPDATE ${process.env.PRIVATE_CHAT_CASSANDRA_TABLE} USING TIMESTAMP ? SET received_at = ? WHERE chat_id=? AND message_id=? AND sequence=?`,[timestamp, received_at, chat_id, message_id, sequence], {prepare: true})
            .then(res => {
                // console.log("SUCCESSFULLY UPDATED THE received_at TIME IN PRIVATE CHAT")
                emitMessage(data);
                
                // now delete it from receiver's pending list
                client.execute(`DELETE FROM ${process.env.PENDING_CASSANDRA_TABLE} USING TIMESTAMP ? WHERE user_id=? AND chat_id=? AND service_type=? AND message_id=? AND sequence=?`,[timestamp, socket.userId, chat_id, un_received_message_service_type, message_id, sequence], {prepare: true})
                    .then(res => {
                        // console.log("SUCCESSFULLY DELETED received message FROM PENDING")
                    })
                    .catch(err => {
                        logError(currentFileName, `ERROR IN DELETING RECEIVED MESSAGE FROM PENDING :: ${err}`);
                    })
            })
            .catch(err => {
                logError(currentFileName, `ERROR IN UPDATING received_at IN PRIVATE CHAT :: ${err}`)
            })

    }
    catch(err){
        logError(currentFileName, err)
    }
}

module.exports = notifyPrivateMessageReceived;