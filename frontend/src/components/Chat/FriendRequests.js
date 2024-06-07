import React, { useState } from 'react';
import './FriendRequests.css'; // Import the CSS file for this component

const FriendRequests = () => {

    // Dummy data for friend requests (replace with actual data from API or state)
  const friendRequests = [
    { id: 1, name: 'John Doe', mobile: '1234567890', sent_at: '2023-08-03' },
    { id: 2, name: 'Jane Smith', mobile: '9876543210', sent_at: '2023-08-02' },
    // Add more friend requests here
  ];

  // State to keep track of accepted and declined friend requests
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);

  // Function to handle accepting a friend request
  const handleAcceptRequest = (requestId) => {
    const acceptedRequest = friendRequests.find((request) => request.id === requestId);
    setAcceptedRequests([...acceptedRequests, acceptedRequest]);
  };

  // Function to handle declining a friend request
  const handleDeclineRequest = (requestId) => {
    const declinedRequest = friendRequests.find((request) => request.id === requestId);
    setDeclinedRequests([...declinedRequests, declinedRequest]);
  };

  return (
    <div className="friend-requests-container">
      <h2>Friend Requests</h2>
      {friendRequests.map((request) => (
        // <div key={request.id} className='friend-request-sub-container'> 
            <div key={request.id} className="friend-request">
            <div className="friend-info">
                <p><strong>Name:</strong> {request.name}</p>
                <p><strong>Mobile:</strong> {request.mobile}</p>
            </div>
            <div className="action-buttons">
                <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                <button onClick={() => handleDeclineRequest(request.id)}>Decline</button>
                <p className="sent-at-text"><small>Sent At:</small> {request.sent_at}</p>
            </div>
            </div>
        // </div>
      ))}
      <h2>Accepted Requests</h2>
      {acceptedRequests.map((request) => (
        <div key={request.id} className="accepted-request">
        <div className="friend-info">
            <p><strong>Name:</strong> {request.name}</p>
            <p><strong>Mobile:</strong> {request.mobile}</p>
        </div>
        <p className="sent-at-text">Accepted at: {request.sent_at}</p>
        </div>
      ))}
      <h2>Declined Requests</h2>
      {declinedRequests.map((request) => (
        <div key={request.id} className="declined-request">
        <div className="friend-info">
            <p><strong>Name:</strong> {request.name}</p>
            <p><strong>Mobile:</strong> {request.mobile}</p>
        </div>
        <p className="sent-at-text">Declined At: {request.sent_at}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
