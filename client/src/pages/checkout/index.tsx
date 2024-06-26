import { useNavigate } from "react-router-dom";

import React from "react";
import { IProduct } from "../../models/interface";
import { useProductStore, useShopStore } from "../../store";
import { CartItem } from "./cartItem";
import "./style.css";
import { useGetToken } from "../../hooks/useGetToken";

const CheckoutPage = () => {
  const { getCartItemCount, getTotalCartAmount, handleCheckout } =
    useShopStore();
  const totalAmount = getTotalCartAmount();
  const { headers } = useGetToken();
  const { products } = useProductStore();

  const navigate = useNavigate();

  return (
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>
      <div className="cart">
        {products.map((product: IProduct) => (
          <React.Fragment key={product._id}>
            {getCartItemCount(product._id) !== 0 && <CartItem data={product} />}
          </React.Fragment>
        ))}
      </div>
      {totalAmount > 0 ? (
        <div className="checkout">
          <p> Subtotal: ₹{totalAmount} </p>
          <button onClick={() => navigate("/")}> Continue Shopping </button>
          <button
            onClick={() => {
              handleCheckout({
                customerId: localStorage.getItem("userID"),
                headers,
                successCallback: () => navigate("/"),
              });
            }}
          >
            Checkout
          </button>
        </div>
      ) : (
        <h1> Your Shopping Cart is Empty</h1>
      )}
    </div>
  );
};

export default CheckoutPage;
