

const loadChatHistory = async(data, setMessages, myMobile, socket) => {
  try{
    setMessages((prevMessages) => {
        const newMessages = new Map(prevMessages);
  
        data.forEach( user => {
          
          let currFriend = newMessages.get(parseInt(user[0]))?.chat;
          if(!currFriend){
            currFriend = new Map();
          }
          const chats = user[1];
          let newMessageCount = 0;
          chats.reverse().forEach(element => {
            
            // const sent_time = new Date(element.sent_at);
            // element.sent_at = sent_time.toLocaleTimeString();
        
            // if(element.sender == user[0] && !element.received_at){
            //     newMessageCount += 1;
            // }

            // const received_time = element.received_at? (new Date(element.received_at)) : (element.sender == user[0]? (new Date()): null);
            // element.received_at = received_time ? received_time.toLocaleTimeString(): null;
            
            // const seen_time = element.seen_at? (new Date(element.seen_at)) : (new Date());
            // element.seen_at = recieved_time.toLocaleTimeString();
        
            currFriend.set(parseInt(element.message_id), element);
            
        })
        // console.log(user[0], newMessageCount);
        newMessages.set(parseInt(user[0]), {pending: newMessageCount, chat: currFriend});
        
    })
  
        return newMessages;
      })

    socket.emit("chat_history_fetching_complete");

  }
  catch(err){
    console.log(err.message)
  }


}

// module.exports = loadChatHistory;
export default loadChatHistory;