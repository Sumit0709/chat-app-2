
const messageSentSuccessfully = (data, setMessages) => {
    console.log("B  ",data)
    try{
      setMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
        const friendMessageList = new Map(newMessages.get(parseInt(data.receiver))?.chat);
        
      //   const sent_time = new Date(data.sent_at);
      //   data.sent_at = sent_time.toLocaleTimeString();

        // const received_time = new Date(data.received_at);
        // data.received_at = sent_time.toLocaleTimeString();

        friendMessageList.set(parseInt(data.message_id), data);
        newMessages.set(parseInt(data.receiver), {pending:0, chat:friendMessageList})
        return newMessages;
      })
    }
    catch(err){
      console.log(err.message)
    }
  }

// module.exports = messageSentSuccessfully
export default messageSentSuccessfully