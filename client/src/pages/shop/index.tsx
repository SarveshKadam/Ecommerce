/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGetToken } from "../../hooks/useGetToken";
import { IProduct } from "../../models/interface";
import { useProductStore } from "../../store";
import { Product } from "./product";
import "./style.css";
const Shop = () => {
  const { fetchProducts, products } = useProductStore();
  const { headers } = useGetToken();

  useEffect(() => {
    if (headers.Authorization) {
      fetchProducts({ headers });
    }
  }, []);
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
