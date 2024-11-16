import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState(1234);

  return (
    <div className="login-container">
      <div className="login-box">
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
        <button className="secondary-btn" onClick={() => navigate("/register")}>Don't have an account?</button>
      </div>
    </div>
  );
}

export default LoginPage;
