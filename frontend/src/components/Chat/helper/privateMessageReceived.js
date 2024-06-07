

const privateMessageReceived = async (data, setFriends, selectedUser, setMessages) => {
    
  try{
    console.log("RECEIVED DATA:: ", data)
    setMessages((prevMessages) => {
      const newMessages = new Map(prevMessages);
      
      // If this is the first chat with this user, then first add it to the friends list
      if(!newMessages.has(parseInt(data.sender))){
        setFriends((oldFriends) => {
          const newFriendList = new Map(oldFriends)
          // console.log(oldFriends)
          // console.log(newFriendList)
          let name = oldFriends.get(parseInt(data.sender));
          name = name? name: "NEW"
          newFriendList.set(parseInt(data.sender), name);
          return newFriendList
        })
      }
      
      const currFriendDoc = newMessages.get(parseInt(data.sender));

      const friendMessageList = new Map(currFriendDoc?.chat);
      const pending = (selectedUser?.mobile == data.sender)? 0: (currFriendDoc? (currFriendDoc.pending + 1):1);

      // const sent_time = new Date(data.sent_at);
      // data.sent_at = sent_time.toLocaleTimeString();

      // const received_time = new Date(data.received_at);
      // data.received_at = sent_time.toLocaleTimeString();
      data.received_at = new Date();
      // console.log(data);
      friendMessageList.set(parseInt(data.message_id), data);
      newMessages.set(parseInt(data.sender), {pending: pending, chat: friendMessageList})
      return newMessages;
    })
  }
  catch(err){
    console.log(err.message)
  }
    
  }

// module.exports = privateMessageReceived;
export default privateMessageReceived;