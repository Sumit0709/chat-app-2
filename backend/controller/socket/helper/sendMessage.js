const cassandra = require('../../../cassandra');
const { emitEvent_Api } = require('../../externalApi.js/emitEvent');
const cachedSocket = require('../cachedSocket');
const setFriendsList = require('./setFriendsList');

const logError = require("../LOG/logError");

const path = require('path');
const currentFileName = path.basename(__filename);

const emitMessage = async (data) => {
    const eventName = 'private_message_to_receiver';
    const mobile = data.receiver;

    emitEvent_Api(eventName, data, mobile);
    // io.to(receiverSocketId).emit("private_message_to_receiver", data)
}

const emitMessageSent = async(socket, data) => {
    socket.emit('private_message_received_by_server', data)
}

const sendMessage = async (io, socket, data) => {
    
    try{
        let client = cassandra.getClient();
        if(!client){
            client = cassandra.connectClient()
            if(!client){
                logError(currentFileName,"Cassandra Client not Found!");
                socket.emit('error', {action: 'send_message', error: `Can't send message, something went wrong!`, data: data});
                return;
            }
        }

        let currFriend = socket.friends.get(parseInt(data.receiver));
        
        if(!currFriend){ // REFRESH FRIENDS LIST
            await setFriendsList(socket);
            currFriend = socket.friends.get(parseInt(data.receiver));
        }

        // THE TWO USERS ARE NOT FRIENDS OR chatId is empty, emit error
        if(!currFriend || !currFriend.chatId || !currFriend.userId){ 
            logError(currentFileName,"Reason :: !currFriend || !currFriend.chatId || !currFriend.userId");
            socket.emit('error', {action: 'send_message', error: `Can't send message, something went wrong!`, data: data});
            return;
        }

        const chat_id = currFriend.chatId
        data.sent_at = new Date()
        const {sender, receiver, message, message_id, type, preview, sent_at, sequence} = data
        // const sent_at = new Date();
        // const received_at = 0;
        // const seen_at = 0;

        // Get Recever Socket ID
        // const receiverSocketId = (await cachedSocket.getSocket(data.receiver)).socketId;

        // Now store message to the cassandra DB

        // privatechat
        // const inserted = await client.execute(`INSERT INTO chat.privatechat (chat_id, sender, receiver, message, sent_at, sequence) VALUES (6ab09bec-e68e-48d9-a5f8-97e6fb4c9b47,916202154736,919155873741,"HELLO TESTING",1691240831251,1)`)
        const timestamp = Date.now();
        client.execute(`INSERT INTO ${process.env.PRIVATE_CHAT_CASSANDRA_TABLE} (chat_id, sender, receiver, message_id, message, type, preview, sent_at, sequence) VALUES (?,?,?,?,?,?,?,?,?) USING TIMESTAMP ?`,[chat_id, sender, receiver,message_id, message, type, preview, sent_at, sequence, timestamp], {prepare: true})
            .then(res => {
                console.log("MESSAGE STORED SUCCESSFULLY IN PRIVATECHAT");
                
                emitMessageSent(socket, data)
                emitMessage(data);
                
                const service_type = 0;
                const user_id = currFriend.userId
                
                client.execute(`INSERT INTO ${process.env.PENDING_CASSANDRA_TABLE} (user_id, chat_id, sender, receiver, service_type, message_id, message, type, preview, sent_at, sequence) VALUES (?,?,?,?,?,?,?,?,?,?,?) USING TIMESTAMP ?`,[user_id, chat_id, sender, receiver, service_type, message_id, message, type, preview, sent_at, sequence, timestamp], {prepare: true})
                .then(res => {
                    // console.log("MESSAGE STORED SUCCESSFULLY IN PENDING");
                })
                .catch(err => {
                    logError(currentFileName, `ERROR IN STORING MESSAGE IN PENDING :: ${err}`)
                })
                
            })
            .catch(err => {
                logError(currentFileName, `ERROR IN STORING MESSAGE IN PRIVATECHAT :: ${err}`)
            })
        
    }
    catch(err){
        logError(currentFileName, err)
    }

}

module.exports = sendMessage;