import { useShallow } from "zustand/react/shallow";
import { IProduct } from "../../models/interface";
import { useShopStore } from "../../store";

interface Props {
  product: IProduct;
}

export const Product = (props: Props) => {
  const { _id, productName, description, price, stock, imageURL } =
    props.product;
  const { addToCart, cartItemCount } = useShopStore(
    useShallow((state) => ({
      addToCart: state.addToCart,
      cartItemCount: state.getCartItemCount(_id),
    }))
  );

  return (
    <div className="product">
      <img src={imageURL} alt={description} />
      <div className="description">
        <h3>{productName}</h3>
        <p>{description}</p>
        <p> ₹{price}</p>
      </div>
      <button
        disabled={stock === 0}
        className="addToCartBttn"
        onClick={() => addToCart(_id)}
      >
        Add To Cart {cartItemCount > 0 && <> ({cartItemCount})</>}
      </button>

      {stock === 0 && (
        <div className="stockQuantity">
          <h1> OUT OF STOCK</h1>
        </div>
      )}
    </div>
  );
};
