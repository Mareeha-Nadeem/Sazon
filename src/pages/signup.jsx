import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle normal signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send signup request to the backend
      const response = await axios.post("http://localhost:5000/auth/signup", {
        name, 
        email,
        password,
      });

      console.log("Signup response:", response.data);
      alert("Signup successful!");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed!");
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/google", {
        token: credentialResponse.credential,
      });
      console.log("User data:", res.data.user);
      alert("Google Signup Successful!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Google Signup failed!");
    }
  };

  return (
    <div>
      <h2>Signup Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <button type="submit">Signup</button>
      </form>

      <p>OR</p>
      <GoogleOAuthProvider clientId="26833402978-kgr7hfustnkudlj6t1l1ah9adb9ung8k.apps.googleusercontent.com">
  <GoogleLogin 
    onSuccess={handleGoogleSignIn} 
    onError={() => console.log("Login Failed")} 
    redirectUri="http://localhost:5173/" // Specify the correct redirect URI here
  />
</GoogleOAuthProvider>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
