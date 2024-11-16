import React from 'react'
import {useNavigate} from "react-router-dom"

const LoginPage = () => {
    const navigate = useNavigate();
  return (
    <div>
        <button onClick={() => {
            navigate("/home");
        }}>Go to users</button>
    </div>
  )
}

export default LoginPage