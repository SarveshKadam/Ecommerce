import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { UserErrors } from "../../error";
import { toast } from "react-toastify";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (event: SyntheticEvent) => {
    try {
      event.preventDefault();
      const response = await axios.post("http://localhost:3001/user/signup", {
        username,
        password,
      });
      if(response.status === 200) {
        toast.success(response.data.message)
      }
    } catch (error) {
      if (error.response.data.type === UserErrors.USER_ALREADY_EXISTS) {
        toast.error("User already exists");
      } else {
        toast.error("Oops!! Somthing went wrong");
      }
    }
  };
  return (
    <div className="auth-card">
      <h2>Sign Up</h2>
      <div className="input-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="auth-btn" type="submit" onClick={handleSubmit}>
        Sign Up
      </button>
      <p>
        Already have a account? Please <Link to="/login">login</Link>
      </p>
    </div>
  );
};

export default SignUp;
