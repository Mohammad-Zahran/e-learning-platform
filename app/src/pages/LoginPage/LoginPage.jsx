import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import logo from './../../assets/logo.svg';  


const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState(1234);

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo and Name */}
        <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="site-name">E-Learn Platform</h1>
        </div>

        <form>
          <input
            className="input-field"
            placeholder='Email Here'
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
          <input
            className="input-field"
            placeholder='Password Here'
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
          <button type="button">
            Login
          </button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/register")}>Go to register</button>
      </div>
    </div>
  );
}

export default LoginPage;
