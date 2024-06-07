

const deleteMessage = async (socket, message, ) => {

    socket.emit('delete_message', message);
    // console.log(message)
}

// module.exports = deleteMessage;
export default deleteMessage;