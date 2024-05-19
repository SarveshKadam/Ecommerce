import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const availableMoney = 5000;
  //   const { availableMoney, isAuthenticated, setIsAuthenticated } =
  //     useContext<IShopContext>(ShopContext);

  //   const logout = () => {
  //     setIsAuthenticated(false);
  //   };

  return (
    <div className="navbar">
      <div className="navbarTitle">
        <h1>MS</h1>
      </div>
      <div className="navbarLinks">
        <>
          <Link to="/">Shop</Link>
          <Link to="/orders">Purchases</Link>
          <Link to="/checkout">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
          {/* <Link to="/auth" onClick={()=> []}>
            Logout
          </Link> */}
          <span> ${availableMoney.toFixed(2)} </span>
        </>
      </div>
    </div>
  );
};
