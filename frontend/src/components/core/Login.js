import React, { useEffect, useState } from 'react';
import './Register.css';
import { login, saveSession } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to the server for registration)
    
    login(formData)
      .then(res => {
        if(res.success){
          saveSession({sessionId: res.sessionId, userId: res.userId}, () => {
            alert(res.message)
            navigate('/');
          })
        }else{
          alert(res.error);
        }
        setFormData({
          mobile: '',
          password: '',
        });
      })
      .catch(err => {
        alert("Something went wrong!")
        setFormData({
          mobile: '',
          password: '',
        });
      })

    
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        <strong>Don't have an Account?</strong>
        <div>
          <button onClick={() => {navigate('/register')}}>Register</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
