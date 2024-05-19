import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserErrors } from "../../models/error";
import { useCookies } from "react-cookie";
import { useShopStore } from "../../store";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookies] = useCookies(["access_token"]);
  const { setIsAuthenticated } = useShopStore();
  const navigate = useNavigate();
  const handleSubmit = async (event: SyntheticEvent) => {
    try {
      event.preventDefault();
      const response = await axios.post("http://localhost:3001/user/signin", {
        username,
        password,
      });
      if (response.status === 200) {
        setCookies("access_token", response.data.token);
        localStorage.setItem("userID", response.data.userID);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      if (error.response.data.type === UserErrors.NO_USER_FOUND) {
        toast.error("No user found");
      } else if (error.response.data.type === UserErrors.WRONG_CREDENTIALS) {
        toast.error("Incorrect Username and Password");
      } else {
        toast.error("Oops!! Somthing went wrong");
      }
    }
  };
  return (
    <div className="auth-card">
      <h2>Login</h2>
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
      <button className="auth-btn" onClick={handleSubmit}>
        Login
      </button>
      <p>
        Don't have a account? Please <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
