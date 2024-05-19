/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import { useGetToken } from "../../hooks/useGetToken";
import { IProduct } from "../../models/interface";
import { useProductStore } from "../../store";
import { Product } from "./product";
import "./style.css";
const Shop = () => {
  const { fetchProducts, products } = useProductStore();
  const { headers } = useGetToken();
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    if (headers.authorization) {
      fetchProducts({ headers });
    }
  }, []);
  if (!cookies.access_token) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="shop">
      <div className="products">
        {products.map((product: IProduct) => (
          <Product product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
