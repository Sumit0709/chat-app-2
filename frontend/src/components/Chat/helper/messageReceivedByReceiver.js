

const messageReceivedByReceiver = async (data, setMessages, selectedUser) => {
    try{
      setMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        const friendMessageList = new Map(newMessages.get(parseInt(data.receiver))?.chat);
        let pending = 0;
        pending = newMessages.get(parseInt(data.receiver))?.pending;
        
      //   const sent_time = new Date(data.sent_at);
      //   data.sent_at = sent_time.toLocaleTimeString();

      //   const received_time = new Date(data.received_at);
      //   data.received_at = received_time.toLocaleTimeString();
        // console.log(data);
        friendMessageList.set(parseInt(data.message_id), data);
        newMessages.set(parseInt(data.receiver), {pending: pending, chat:friendMessageList})
        return newMessages;
      })
    }
    catch(err){
      console.log(err.message);
    }
  }

// module.exports = messageReceivedByReceiver
export default messageReceivedByReceiver