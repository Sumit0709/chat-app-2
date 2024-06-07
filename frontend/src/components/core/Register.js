import React, { useState } from 'react';
import './Register.css';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    name: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(formData.email.trim().length==0 || formData.mobile.trim().length==0 || formData.name.trim().length==0 || formData.password.trim().length==0){
      alert("All fields are mandatory!");
      return;
    }

    // Request sent to server
    register(formData)
    .then(res => {
        console.log(res);
        if(res.success){
          setFormData({
              email: '',
              mobile: '',
              name: '',
              password: '',
          });
          alert(res.message);
          navigate('/login')
        }
        else{
          alert(res.error)
        }
    })
    .catch(err => {
        alert(err.message)
    })
    
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
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
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
          <button type="submit">Register</button>
        </div>
        <strong>Already have an Account?</strong>
        <div>
          <button onClick={() => {navigate('/login')}}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
