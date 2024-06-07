

const receivedPending = async(socket, data, setMessages, selectedUser) => {
  try{
    setMessages((prevMessages) => {
      const newMessages = new Map(prevMessages);

      data.forEach( element => {
        // console.log(element)
        // let currFriend = newMessages.get(123);
        let currFriendObj = newMessages.get(parseInt(element.sender));
        let newPendingCount = 0;
        if(!currFriendObj){
          currFriendObj = {pending: 0, chat: new Map()};
        }else if(element.sender != selectedUser?.mobile){
          if(element.service_type == 0){
            newPendingCount = currFriendObj.pending + 1;
          }
          else{ 
            newPendingCount = currFriendObj.pending;
          }
        }
        const currFriend = currFriendObj.chat

        // console.log("CURR FRIEND 2",typeof(currFriend))
        // const sent_time = new Date(element.sent_at);
        // element.sent_at = sent_time.toLocaleTimeString();
  
        // const recieved_time = new Date();
        // element.recieved_at = recieved_time.toLocaleTimeString();
        element.received_at = new Date();
  
        element.seen_at = null;
  
        currFriend.set(parseInt(element.message_id), element);
        newMessages.set(parseInt(element.sender), {pending: newPendingCount, chat: currFriend});

        // console.log(element)
        if(element.service_type == 0){
          // pending message is received
          socket.emit('notify_private_message_received_by_receiver', element)
        }
      })

      return newMessages;
    })
  }catch(err){
    console.log(err.message);
  }
  }

// module.exports = receivedPending
export default receivedPending



// OLD


  // const receivedPending = async(data) => {

  //   setMessages((prevMessages) => {
  //     const newMessages = new Map(prevMessages);

  //     data.forEach( element => {
  //       // console.log(element)
  //       // let currFriend = newMessages.get(123);
  //       let currFriendObj = newMessages.get(parseInt(element.sender));
  //       let newPendingCount = 0;
  //       if(!currFriendObj){
  //         currFriendObj = new Map();
  //       }else if(element.sender != selectedUser?.mobile){
  //         if(element.service_type == 0){
  //           newPendingCount = currFriendObj.pending + 1;
  //         }
  //         else{ 
  //           newPendingCount = currFriendObj.pending;
  //         }
  //       }
  //       const currFriend = currFriendObj.chat

  //       // console.log("CURR FRIEND 2",typeof(currFriend))
  //       const sent_time = new Date(element.sent_at);
  //       element.sent_at = sent_time.toLocaleTimeString();
  
  //       const recieved_time = new Date();
  //       element.recieved_at = recieved_time.toLocaleTimeString();
  
  //       element.seen_at = null;
  
  //       currFriend.set(parseInt(element.message_id), element);
  //       newMessages.set(parseInt(element.sender), {pending: newPendingCount, chat: currFriend});

  //       // console.log(element)
  //       if(element.service_type == 0){
  //         // pending message is received
  //         socket.emit('notify_private_message_received_by_receiver', element)
  //       }
  //     })

  //     return newMessages;
  //   })
  // }