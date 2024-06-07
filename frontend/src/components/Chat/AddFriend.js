import React, { useState } from 'react';
import './AddFriend.css'; // Import the CSS file for styling
import { useNavigate, useParams } from 'react-router-dom';
import { addFriend } from '../../api/user';

const AddFriend = () => {
    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');

    const {mobile: myMobile} = useParams();
    const navigate = useNavigate();


    const onAddFriend = (mobile, name) => {

    addFriend({friendsMobile: mobile, friendsName: name})
        .then(res => {
            if(res.success){
                alert(res.message);
                navigate('/');
            }else{
                alert(res.error);
            }
        })
        .catch(err => {
            alert(err.message);
        })

    }


    const handleAddFriend = () => {
    // Validate input data (you can add more validation as needed)
    if (!mobile.trim() || !name.trim()) {
        alert('Please enter both mobile number and name.');
        return;
    }

    // Call the onAddFriend function to add the friend
    onAddFriend(mobile, name);

    // Clear input fields after adding the friend
    setMobile('');
    setName('');
    };

    return (
    <div className="add-friend-container">
        <h2>Add Friend</h2>
        <div className="input-group">
        <label htmlFor="mobile">Mobile Number:</label>
        <input
            type="text"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
        />
        </div>
        <div className="input-group">
        <label htmlFor="name">Name:</label>
        <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        </div>
        <button onClick={handleAddFriend}>Add Friend</button>
    </div>
    );
};

export default AddFriend;
