import React, { useState, useEffect, Fragment } from 'react';
import io from 'socket.io-client';
import { isAuthenticated, loginStatus, logout } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import loadChatHistory from './helper/loadChatHistory';

import sendIMG from '../../media/send.png'
import sending from '../../media/sending.svg'
import sent from '../../media/sent.svg'
import received from '../../media/received.svg'
import seen from '../../media/seen.svg'
import receivedPending from './helper/receivedPending';
import sendMessageToServer from './helper/sendMessage';
import privateMessageReceived from './helper/privateMessageReceived';
import messageSentSuccessfully from './helper/messageSentSuccessfully';
import messageReceivedByReceiver from './helper/messageReceivedByReceiver';
import onSetLastSeen from './helper/setLastSeen';
import getTime from './helper/getTime';
import deleteMessage from './helper/deleteMessage';
import Loading from '../core/Loading';

let socket = null;

const Chat2 = () => {

  const [messages, setMessages] = useState(new Map());
  const [messageInput, setMessageInput] = useState('');
  const [friends, setFriends] = useState(new Map());
  const [selectedUser, setSelectedUser] = useState(null);
  const [mobile, setMobile] = useState("");

  const [lastSeen, setLastSeen] = useState(new Map());
  const [showOverlay, setShowOverlay] = useState(null)

  const { sessionId, userId } = isAuthenticated();
  // console.log(sessionId)
  // console.log(userId)
  const navigate = useNavigate();

  useEffect(() => {
    // checkLoginStatus();
    connectSocket();

    // Clean up the socket connection on unmount
    return () => {
      socket && socket.disconnect();
    };
  }, []);

  const checkLoginStatus = () => {
    loginStatus()
      .then((res) => {
        if (res.success && sessionId && userId) {
          // connectSocket(res.mobile);
          setMobile(res.mobile);
        } else {
          console.log(res.error)
          navigate('/login');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const connectSocket = () => {
    socket = io(process.env.REACT_APP_SERVER_URL, {
      extraHeaders: {
        SessionId: sessionId,
        userId: userId,
        // mobile: mobile,
      },
      withCredentials: true
    });

    let interval = null;
    
    socket.on('connect', (err) => {
      // console.log('Connection established from Client Side');
      // if(selectedUser != null){
        socket.emit('get_last_seen', selectedUser);
      // }
      
      const getLastSeen = () => {
        // if(selectedUser != null){
          socket.emit('get_last_seen', selectedUser);
        // }
      };
      interval = setInterval(getLastSeen, 5000); // Emit every 5 seconds
    });

    socket.on('logout_user', async () => {
      // logout user and disconnect socket
      await logout();
      navigate('/login')
      socket.disconnect();
    })

    socket.on('connection_successfull', (data) => {
      console.log(`Connected to server ${data.server}`)
      setMobile(data.mobile);
    })

    socket.on('set_last_seen', (data) => {
      onSetLastSeen(data, setLastSeen)
    })
    
    socket.on("friends_list", (data) => {
      // console.log("FRIENDS")
      onFriendsList(data);
    })

    // chat history
    socket.on("chat_history", (data) => { 
      // console.log(data);
      loadChatHistory(data, setMessages, mobile, socket)
    })

    // private message received by the client
    socket.on('private_message_to_receiver', async (data) => {
      await privateMessageReceived(data, setFriends, selectedUser, setMessages);
      socket.emit('notify_private_message_received_by_receiver', data)
    });

    // message is stored on db, i.e. sent successfully
    socket.on('private_message_received_by_server', (data) => {
      // console.log("Message sent")
      // console.log(data);
      messageSentSuccessfully(data, setMessages); 
    })

    socket.on('notifying_private_message_received_to_sender', (data) => {
      // console.log("NPMRTS :: ",data);
      messageReceivedByReceiver(data, setMessages, selectedUser);
    })

    socket.on("pending", (data) => {
      // console.log("PENDING", data);
      // receivedPending(data);
      receivedPending(socket, data, setMessages, selectedUser);
    })

    socket.on('error', (data) => {
      console.log("ERROR :: ", data)
    })

    socket.on('disconnect', (reason) => {
      if(interval){
        clearInterval(interval)
      }
    })
  };

  const sendMessage = () => {
    sendMessageToServer(messageInput, socket, mobile, selectedUser, messages, setMessages, setMessageInput);
  };


  const onFriendsList = (data) => {
    // console.log("RECEIVED FRIENDS LIST :: ", data.friends);
    const newfriendList = new Map(); 
    data.friends.forEach(f => {
      newfriendList.set(f.mobile, f.name);
    })
    setFriends(newfriendList)
  }

  const handleUserSelect = (user) => {
    setMessages((prevMessages) => {
      const newMessages = new Map(prevMessages);
      let friendMessageList = new Map(newMessages.get(parseInt(user.mobile))?.chat);
      if(!friendMessageList){
        friendMessageList = new Map();
      }
      newMessages.set(parseInt(user.mobile), {pending: 0, chat:friendMessageList})
      return newMessages
    })
    setSelectedUser(user);
    if(socket){
      socket.emit('user_active');
    }
  };


  const onMessageClick = (message) => () => {
    if(socket){
      socket.emit('user_active');
    }
    setShowOverlay(message)
  }


  // Function to scroll to the bottom of the container
  useEffect(() => {
    const messageContainer = document.getElementById("messageContainer");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);
  
  const sendingIcon = () => {
    return (
      <img height='18px' width='18px' src={sending} style={{margin: '0px 3px 0px 7px'}}/>
    )
  }
  const sentIcon = () => {
    return (
      <img height='18px' width='18px' src={sent} style={{margin: '0px 3px 0px 7px'}}/>
    )
  }
  const receivedIcon = () => {
    return (
      <img height='18px' width='18px' src={received} style={{margin: '0px 3px 0px 7px'}}/>
    )
  }
  const seenIcon = () => {
    return (
      <img height='18px' width='18px' src={seen} style={{margin: '0px 3px 0px 7px'}}/>
    )
  }

  const handleMessageKeyDown = (e) => {
    if((e.key == 'Enter' || e.keyCode == 13) && !e.shiftKey){
      e.preventDefault();
      sendMessage()
    }
  }

  const alertDemoProjectStatus = () => {
    alert("This website is developed by Sumit Ranjan Choudhary. It's a demo project and is not intended for production use.")
  }

  const onAddFriend = () => {
    navigate('/add_friend')
  }

  return (
    <Fragment>
    {!mobile && <Loading/>}
    {mobile && 
    <div className="App">
      
      <div className='top-band'>
        <div onClick={alertDemoProjectStatus} style={{cursor: 'pointer'}}><small>Demo Project.</small>
        <div><strong style={{color:'#ad158c'}}>© 2023</strong></div>
          </div>
        <div>{selectedUser ?
            <div className='friend-details'>
              <h3> {selectedUser.name}</h3>
              <small style={{color: '#222'}}>{selectedUser.mobile}</small>
              <small><strong>{lastSeen.get(selectedUser.mobile)}</strong></small>
            </div>
            : <div/>
        }
        </div>
      </div>
      <div className="chat-container">
        <div className="friends-list">
          {/* <h2>Users</h2> */}
          <ul>
            {friends && Array.from(friends).map(([mobile, name]) => (
              <li className={selectedUser && mobile == selectedUser.mobile? "selected-friend": "unselected-friend"} key={mobile} onClick={() => handleUserSelect({name: name, mobile: mobile})}>
                {name}
                <small className='pending-message'>{messages && messages.get(mobile) && messages.get(mobile).pending!=0  && <small>{messages.get(mobile).pending}</small>}</small>
              </li>
            ))}
          </ul>
          <div><span className='add-friend' onClick={onAddFriend}>+</span></div>
        </div>
        <div className="chat-history">
          {/* <h2>Chat History</h2> */}
          {selectedUser ?  (
            <div>
              {/* <h3> {selectedUser.name}</h3> */}
              <div id="messageContainer" className="message-container">
                {messages.get(selectedUser.mobile) && friends.has(selectedUser.mobile) && Array.from(messages.get(selectedUser.mobile).chat)
                  // .filter(
                  //   (message) =>
                  //     message.sender == selectedUser.mobile || message.receiver == selectedUser.mobile
                  // )
                  .map(([key, message]) => (
                    <div key={key} className="messages">
                      {message.sender == mobile ? 
                      <span className='message-by-me'>
                        <div className='message-m' onClick={onMessageClick(message)}>{message.message}
                          <div className='sent_at_time'>{message.sent_at?getTime(message.sent_at):'Sending...'}</div>
                        </div>
                        {message.seen_at && message.seen_at!=0? seenIcon() :
                          message.received_at && message.received_at!=0? receivedIcon():
                          message.sent_at && message.sent_at!=0 ? sentIcon():
                          sendingIcon()}
                      </span>
                        :
                        <span className='message-by-friend'>
                        {/* {message.seen_at && message.seen_at!=0? seenIcon() :
                          message.received_at && message.received_at!=0? receivedIcon():
                          message.sent_at && message.sent_at!=0 ? sentIcon():
                          sendingIcon()} */}
                        <div className='message-f' onClick={onMessageClick(message)}>{message.message}
                          <div className='received_at_time'>{getTime(message.received_at)}</div>
                        </div>
                      </span>}
                    </div>
                  ))}

              </div>
              <div className="input-container">
                <textarea
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onKeyDown={handleMessageKeyDown}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <div onClick={sendMessage}>
                <span className="d-none d-sm-inline-block mr-2">Send</span>
                {/* <svg width={13} height={13} viewBox="0 0 24 24" tabIndex={-1}>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white" />
                </svg> */}
                  {/* <img style={{height: '8vh'}} src={sendIMG}/> */}
                </div>
                {/* <button style={{ }} >
                  Send
                </button> */}
              </div>
            </div>
          ) : (
            <p className='default-message'>Select a user to start chatting.</p>
          )}
        </div>
      </div>
      {/* <button onClick={onAddFriend}>Add Friend</button> */}

      {socket && selectedUser && showOverlay && (
        <div className="overlay">
          <div className='overlay_bg' onClick={() => {setShowOverlay(null)}}/>
          <div className="overlay-content">
            <div className='close-overlay'><span onClick={() => {setShowOverlay(null)}}>X</span></div>
            <table>
              <tbody>
              <tr>
                <td>Message</td>
                <td>{showOverlay.message}</td>
              </tr>
              <tr>
                <td>Sent By</td>
                <td>{showOverlay.sender == selectedUser.mobile? selectedUser.name: 
                showOverlay.sender == mobile? "You": showOverlay.sender}</td>
              </tr>
              <tr>
                <td>Sent</td>
                <td>{showOverlay.sent_at? getTime(showOverlay.sent_at): "Message not sent"}</td>
              </tr>
              <tr>
                <td>Received</td>
                <td>{showOverlay.received_at? getTime(showOverlay.received_at) : "Message not received"}</td>

              </tr>
              <tr>
                <td>Seen</td>
                <td>{showOverlay.seen_at? getTime(showOverlay.seen_at) : "Message not seen"}</td>
              </tr>
             
              </tbody>
            </table>
            {/* {showOverlay.sender == mobile && 
            <button className='delete-message' onClick={() => deleteMessage(socket, showOverlay)}>Delete</button>} */}
            {/* <button onClick={handleCloseOverlay}>Close</button> */}
          </div>
        </div>
      )}
    </div>}
    </Fragment>
  );
};

export default Chat2;
