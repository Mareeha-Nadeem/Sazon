import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './login.css';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert("Login failed! " + (error.response?.data?.message || ""));
    }
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", "true");
      alert("Google Login Successful!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert("Google Login failed!");
    }
  };
  return (
    <div className="login-page">
      <div className="login-form-container">
      <div 
  className="login-heading" 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    whiteSpace: 'nowrap', // THIS PREVENTS WRAPPING
    gap: '8px' 
  }}
>
  <h2 style={{ margin: 0 }}>Login to</h2>
  <img
    src="sazon logo txt.png"
    alt="Sazon Logo"
    className="logo-image"
    style={{ height: '30px' }}
  />
</div>



  
        <form onSubmit={handleSubmit}>
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
  
          <button type="submit">Login</button>
        </form>
  
        <div className="or-divider">
          <hr />
          <span>OR</span>
        </div>
  
        <GoogleOAuthProvider clientId="26833402978-kgr7hfustnkudlj6t1l1ah9adb9ung8k.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => console.log("Google Login Failed")}
          />
        </GoogleOAuthProvider>
  
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
