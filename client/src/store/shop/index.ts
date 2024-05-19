import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IProduct } from "../../models/interface";
import useProductStore from "../products";

const initialState = {
  cartItems: {},
};

const store = (set: (arg0: any) => void, get: any) => {
  const actions = {
    addToCart: (itemID: string) => {
      set(
        produce((draft: any) => {
          draft.cartItems[itemID] = draft.cartItems[itemID] + 1 || 1;
        })
      );
    },
    removeFromCart: (itemID: string) => {
      set(
        produce((draft: any) => {
          if (!draft.cartItems[itemID]) {
            return;
          }
          draft.cartItems[itemID] = draft.cartItems[itemID] - 1;
        })
      );
    },
    updateCartItemCount: (newAmount: number, itemId: string) => {
      set(
        produce((draft: any) => {
          draft.cartItems[itemId] = newAmount;
        })
      );
    },
    getCartItemCount: (itemId: string) => {
      if (itemId in get().cartItems) {
        return get().cartItems[itemId];
      }

      return 0;
    },
    getTotalCartAmount: () => {
      const { products } = useProductStore.getState();
      if (products.length === 0) return 0;

      let totalAmount = 0;
      const { cartItems } = get();
      for (const item in cartItems) {
        if (cartItems[item] > 0) {
          let itemInfo: IProduct = products.find(
            (product) => product._id === item
          );

          totalAmount += cartItems[item] * itemInfo.price;
        }
      }
      return Number(totalAmount.toFixed(2));
    },
  };
  return {
    ...initialState,
    ...actions,
  };
};

const devStore = devtools(store, {
  anonymousActionType: "ProductData",
});

const useShopStore = create(devStore);

export default useShopStore;
