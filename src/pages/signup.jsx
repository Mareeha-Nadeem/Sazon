import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './login.css'; // Use separate CSS as you prefer

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      alert("Signup failed!");
    }
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/google", {
        token: credentialResponse.credential,
      });

      alert("Google Signup Successful!");
      navigate("/login");
    } catch (error) {
      alert("Google Signup failed!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <div className="login-heading">
          <h2>Sign up for</h2>
          <img
            src="sazon logo txt.png"
            alt="Sazon Logo"
            className="logo-image"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Signup</button>
        </form>

        <div className="or-divider">
          <hr />
          <span>OR</span>
        </div>

        <GoogleOAuthProvider clientId="26833402978-kgr7hfustnkudlj6t1l1ah9adb9ung8k.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => console.log("Google Signup Failed")}
          />
        </GoogleOAuthProvider>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
