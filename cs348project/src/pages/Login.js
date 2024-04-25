import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import CSS file for styling

const Login = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '' });
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleToggleForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Implement login logic here
    axios.post('http://localhost:8000/user/login', {
        username: loginData.username,
        password: loginData.password
    })
        .then((res) => {
            console.log('Logging in with:', loginData);
            console.log(res);
            navigate('/home', {state: {username: loginData.username, userID: res.data.userID}});
        })
        .catch((err) => {
            console.log(err)
        })
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log(registerData.username)
    if (registerData.password === registerData.confirmPassword) {
        axios.post('http://localhost:8000/user/register', {
            username: registerData.username,
            password: registerData.password
        })
            .then((res) => {
                console.log('Registering with:', registerData);
                console.log(res);
                navigate('/home', {state: {username: registerData.username, userID: res.data.userID}})
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        console.log("passwords do not match")
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>{showRegisterForm ? 'Register' : 'Login'}</h2>
        <form onSubmit={showRegisterForm ? handleRegisterSubmit : handleLoginSubmit}>
            
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={showRegisterForm ? registerData.username : loginData.username}
              onChange={showRegisterForm ? handleRegisterChange : handleLoginChange}
              required
            />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={showRegisterForm ? registerData.password : loginData.password}
            onChange={showRegisterForm ? handleRegisterChange : handleLoginChange}
            required
          />
          {showRegisterForm &&
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              required
            />
          }
          <button type="submit">{showRegisterForm ? 'Register' : 'Login'}</button>
        </form>
        <p onClick={handleToggleForm}>{showRegisterForm ? 'Already have an account? Login here' : 'Don\'t have an account? Register here'}</p>
      </div>
    </div>
  );
};

export default Login;
