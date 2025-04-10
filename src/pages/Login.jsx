import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // To redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", "true"); // ✅ added this line
      alert("Login successful!");
      navigate("/");
      window.location.reload(); // ✅ force navbar update
    } catch (error) {
      alert("Login failed! " + (error.response?.data?.message || ""));
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", "true"); // ✅ added this line too
      alert("Google Login Successful!");
      navigate("/");
      window.location.reload(); // ✅ same refresh here too
    } catch (error) {
      alert("Google Login failed!");
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
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

      <p>OR</p>
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
  );
}

export default Login;
