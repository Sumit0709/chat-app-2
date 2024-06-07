
const sendMessageToServer = async (messageInput, socket, mobile, selectedUser, messages, setMessages, setMessageInput) => {
  
  try{

    if (messageInput.trim() !== '' && socket) {
      // Send message to the server

      const seq = parseInt(Math.random()*100000)
      const message_id = Date.now();
      // const currTime = (new Date()).toLocaleTimeString(); 

      socket.emit('private_message_from_sender', { message: messageInput, type:0, preview: '', sender: mobile.toString(), receiver: selectedUser.mobile.toString(), sent_at: 0, received_at: 0, seen_at: 0, sequence: seq, message_id: message_id.toString() });
      // setMessages((prevMessages) => [...prevMessages, { message: messageInput, type:0, preview: '', sender: mobile, receiver: parseInt(selectedUser.mobile), sent_at: 0, received_at: 0, seen_at: 0, sequence: seq }]);
      
      const prevMessages = messages;
      const newMessages = new Map(prevMessages);

      const friendMessageList = new Map(prevMessages.get(selectedUser.mobile)?.chat);
      friendMessageList.set(message_id, { message: messageInput, type:0, preview: '', sender: mobile, receiver: parseInt(selectedUser.mobile), sent_at: 0, received_at: 0, seen_at: 0, sequence: seq })

      newMessages.set(parseInt(selectedUser.mobile),{pending: 0, chat: friendMessageList})
      setMessages(newMessages);

      setMessageInput('');
    }
  }
  catch(err){
    console.log(err.message)
  }
  };

// module.exports = sendMessageToServer;
export default sendMessageToServer;


// OLD

// const sendMessage = () => {
//     if (messageInput.trim() !== '' && socket) {
//       // Send message to the server

//       const seq = parseInt(Math.random()*100000)
//       const message_id = Date.now();
//       const currTime = (new Date()).toLocaleTimeString(); 

//       socket.emit('private_message_from_sender', { message: messageInput, type:0, preview: '', sender: mobile.toString(), receiver: selectedUser.mobile.toString(), sent_at: 0, received_at: 0, seen_at: 0, sequence: seq, message_id: message_id.toString() });
//       // setMessages((prevMessages) => [...prevMessages, { message: messageInput, type:0, preview: '', sender: mobile, receiver: parseInt(selectedUser.mobile), sent_at: 0, received_at: 0, seen_at: 0, sequence: seq }]);
      
//       const prevMessages = messages;
//       const newMessages = new Map(prevMessages);

//       const friendMessageList = new Map(prevMessages.get(selectedUser.mobile).chat);
//       friendMessageList.set(message_id, { message: messageInput, type:0, preview: '', sender: mobile, receiver: parseInt(selectedUser.mobile), sent_at: 0, received_at: 0, seen_at: 0, sequence: seq })

//       newMessages.set(parseInt(selectedUser.mobile),{pending: 0, chat: friendMessageList})
//       setMessages(newMessages);

//       setMessageInput('');
//       scrollToBottom()
//     }
//   };