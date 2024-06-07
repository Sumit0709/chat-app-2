const cookie = require('cookie')
const cassandra = require('../../cassandra');
const addNewMessage = require('../helper/addNewMessage');
const getFriendList = require('../helper/getFriendList');
const setFriendList = require('../helper/setFriendList');
const cachedLastSeen = require('./cachedLastSeen');
const cachedSocket = require('./cachedSocket');
const emitPending = require('./helper/emitPending');
const last50messages = require('./helper/getLast50messages');
const getLastSeenOfAllFriends = require('./helper/getLastSeenOfAllFriends');
const notifyPrivateMessageReceived = require('./helper/notifyPrivateMessageReceived');
const sendMessage = require('./helper/sendMessage');
const setFriendsList = require('./helper/setFriendsList');
const verifyTokenInSocket = require('./verifyTokenInSocket');
const { setLastSeen_Api } = require('../externalApi.js/lastSeen');
const { userConnected_Api } = require('../externalApi.js/userConnection');
const logError = require('./LOG/logError');
const Redis = require('ioredis')

const emitFriendsList = (socket) => {
    socket.emit('friends_list', {friends: socket.friendsArray});
}

const path = require('path');
const currentFileName = path.basename(__filename);

const redis = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
})

const pub = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
})
const sub = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
})

const chat = (io) => {

    io.on("connection", async (socket) => {

        try{
        // Access cookies from socket.handshake.headers.cookie
        let cookies = socket.handshake.headers.cookie;
        let parsedCookies = "";
        
        if(cookies){
            cookies = cookies.toString();
            parsedCookies = cookie.parse(cookies);
        }
        else{
            cookies = "";
        }
        const loginStatus = await verifyTokenInSocket(parsedCookies);

        if(!loginStatus.success){
            socket.emit('logout_user')
            socket.disconnect()
            return;
        }
        else{
            socket.mobile = loginStatus.data.mobile;
            socket.userId = loginStatus.data.userId;
            socket.sessionId = loginStatus.data.sessionId;

        }
        
        // console.log("HANDSHAKE :: ", socket.handshake);
        // console.log(process.env.PORT);
        const serverPort = process.env.PORT || 8080;
        // let saveSocketData = await userConnected_Api(socket.mobile, socket.id, serverPort)
        // if(!saveSocketData){
        //     socket.disconnect();
        //     return;
        // }
        const serverNumber = serverPort%10;
        socket.emit('connection_successfull', {mobile: socket.mobile, server: serverNumber});
            
        
        const sessionId = socket.sessionid;
        const userId = socket.userId;
        const mobile = socket.mobile;
        

        await setFriendsList(socket);
        // SUBSCRIBE TO ROOMS

        const my_private_room_id = `room:private:${socket.userId}`
        // console.log("my_private_room_id :: ", my_private_room_id);
        // console.log("F_UID_ARRAY :: ",socket.friendsRoomIdArray)
        sub.subscribe(my_private_room_id,(err, count) => {
            if (err) {
                console.error("Failed to subscribe to my redis room: %s", err.message);
            } else {
                // `count` represents the number of channels this client are currently subscribed to.
                console.log(
                    `Subscribed successfully! This client is currently subscribed to ${count} channels.`
                );
            }
        })

        sub.on("message", (channel, message) => {
            if(channel == my_private_room_id){
                // console.log(`Received ${message} from ${channel}`);
                const data = JSON.parse(message);
                socket.emit(data.response_socket_event_name, data)
            }
        });
        // await getFriendListLocal(socket)
        
        cachedSocket.setSocket(mobile, socket.id);
        
        // Emit FriendsList to user when he connects to the socket
        emitFriendsList(socket);
        // last50messages(socket);

        socket.on('get_last_seen', async () => {
            
            let lastSeens = []

            for(let friend of socket.friendsArray){
                // console.log(friend)
                const ls = await redis.get(`last_seen:${friend.userId}`)
                lastSeens.push({mobile: friend.mobile, lastSeen: ls});
            }

            socket.emit('set_last_seen', lastSeens)
                // set_last_seen
            // getLastSeenOfAllFriends(socket);
        })

        socket.on('user_active', () => {
            redis.set(`last_seen:${socket.userId}`, Date.now())
            // setLastSeen_Api(socket.mobile)
        })

        socket.on('chat_history_fetching_complete', async () => {
            await emitPending(socket)
        })

        // this user is sending private message to some other user
        socket.on('private_message_from_sender', async (data) => {
            // console.log("DATA :: ", data)
            redis.set(`last_seen:${socket.userId}`, Date.now())
            // setLastSeen_Api(socket.mobile)
            let friend_room_id = `room:private:${socket.friends.get(parseInt(data.receiver))?.userId}`;
            // console.log("friend_room_id :: ", friend_room_id);
            data = {...data, sent_at: Date.now(), response_socket_event_name: "private_message_to_receiver"}
            pub.publish(friend_room_id, JSON.stringify(data));
            
            socket.emit('private_message_received_by_server',data);

            // sendMessage(io, socket, data);
        }) 

        // This user has received the private message from someone
        socket.on('notify_private_message_received_by_receiver', async (data) => {
            // TODO::
            // Add kafka here to store the message and then update to DB in batch
            
            let friend_room_id = `room:private:${socket.friends.get(parseInt(data.sender))?.userId}`;
            // console.log("rrrr friend_room_id :: ", socket.friends.get(parseInt(data.sender)));
            data = {...data, received_at: Date.now(), response_socket_event_name: "notifying_private_message_received_to_sender"}
            pub.publish(friend_room_id, JSON.stringify(data));
            // notifyPrivateMessageReceived(io, socket, data);
        })


        socket.on('disconnect', (reason) => {
            // console.log("Disconnected")
        })

        socket.on("error", (err) => {
        if (err){
            logError(currentFileName, err)
        }
        });
        
        }
        catch(err){
            logError(currentFileName, `ERROR IN ESTABLISHING CONNECTION TO USER/ NOT A SOCKET ERROR :: ${err}`)
        }
    });

}

module.exports = chat;
