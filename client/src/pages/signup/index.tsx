import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserErrors } from "../../models/error";
import { axiosInstance } from "../../utilities";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event: SyntheticEvent) => {
    try {
      event.preventDefault();
      const response = await axiosInstance.post("/user/signup", {
        username,
        password,
      });
      if(response.status === 200) {
        toast.success(response.data.message)
        navigate("/login")
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
