import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useShopStore } from "../store";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const { availableMoney, setIsAuthenticated, isAuthenticated } =
    useShopStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookie] = useCookies(["access_token"]);
  const logout = () => {
    setCookie("access_token", null);
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <div className="navbar">
      <div className="navbarTitle">
        <h1>MS</h1>
      </div>
      <div className="navbarLinks">
        {isAuthenticated && (
          <>
            <Link to="/">SHOP</Link>
            <Link to="/orders">ORDERS</Link>
            <Link to="/checkout">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
            <Link to="/login" onClick={() => logout()}>
              LOGOUT
            </Link>
            <span> ₹{availableMoney.toFixed(2)} </span>
          </>
        )}
      </div>
    </div>
  );
};
