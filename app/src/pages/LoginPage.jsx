import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("test@test.com");
    const [password, setPassword] = useState(1234);
  return (
    <div>
        <div>
            <div>
                <form>
                    <input
                    placeholder='Email Here'
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    />
                    <input
                    placeholder='Password Here'
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    />
                    <button type="button">
                        Login
                    </button>
                </form>
            </div>
        </div>
        <button onClick={() => {
            navigate("/home");
        }}>Go to users</button>
    </div>
  )
}

export default LoginPage