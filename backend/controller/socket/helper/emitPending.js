const cassandra = require("../../../cassandra");
const logError = require("../LOG/logError");

const path = require('path');
const currentFileName = path.basename(__filename);

const emitPending = async (socket) => {

    let client = cassandra.getClient();
    if(!client){
        client = cassandra.connectClient()
        if(!client){
            socket.emit('error', {action: 'pending', error: `Can't read message, something went wrong!`});
            logError(currentFileName,"Cassandra Client not Found!");
            return;
        }
    }
    
    client.execute(`SELECT sender, receiver, service_type, message, message_id, type, preview, sent_at, sequence FROM ${process.env.PENDING_CASSANDRA_TABLE} WHERE user_id=?`,[socket.userId],{prepare: true})
        .then(res => {
            // console.log("Number of pending rows = ",res.rows.length)
            // console.table(res.rows);
            socket.emit('pending', res.rows);
        })
        .catch(err => {
            logError(currentFileName,`ERROR IN READING PENDING :: ${err}`);
            socket.emit('error', {action: 'pending', error: `Can't read message, something went wrong!`});
            return;
        })

}

module.exports = emitPending;