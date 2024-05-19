import { produce } from "immer";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ProductErrors, UserErrors } from "../../models/error";
import { IProduct } from "../../models/interface";
import { axiosInstance } from "../../utilities";
import useProductStore from "../products";

const initialState = {
  cartItems: {},
  purchasedItems: [],
  availableMoney: 0,
  isAuthenticated: false,
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
    setIsAuthenticated: (value: any) => {
      set(
        produce((draft: any) => {
          draft.isAuthenticated = value;
        })
      );
    },
    fetchAvailableMoney: async () => {
      try {
        const cookies = new Cookies();
        const cookieValue = cookies.get("access_token");
        const response = await axiosInstance.get(
          `/user/available-money/${localStorage.getItem("userID")}`,
          {
            headers: {
              authorization: cookieValue,
            },
          }
        );
        set(
          produce((draft: any) => {
            draft.availableMoney = response.data.availableMoney;
          })
        );
      } catch (error) {
        //handle error
      }
    },
    fetchPurchasedItems: async () => {
      try {
        const cookies = new Cookies();
        const cookieValue = cookies.get("access_token");
        const response = await axiosInstance.get(
          `/product/purchased-items/${localStorage.getItem("userID")}`,
          {
            headers: {
              authorization: cookieValue,
            },
          }
        );
        set(
          produce((draft: any) => {
            draft.purchasedItems = response.data.purchasedItems;
          })
        );
      } catch (error) {
        // handle error
      }
    },
    handleCheckout: async (params: any) => {
      try {
        const { headers, customerId, successCallback } = params;
        const response = await axiosInstance.post(
          "/product/checkout",
          {
            customerId,
            cartItems: get().cartItems,
          },
          {
            headers,
          }
        );
        await get().fetchAvailableMoney({ headers });
        set(
          produce((draft: any) => {
            draft.purchasedItems.push(response.data.purchasedItems);
            draft.cartItems = {};
          })
        );
        if (successCallback) {
          successCallback();
        }
        toast.success("Your Order is on the way");
      } catch (error) {
        let errorMessage: string = "";
        switch (error.response.data.type) {
          case ProductErrors.NO_PRODUCT_FOUND:
            errorMessage = "No product found";
            break;
          case UserErrors.NOT_ENOUGH_BALANCE:
            errorMessage = "Not enough money";
            break;
          case ProductErrors.STOCK_EMPTY:
            errorMessage = "Not enough stock";
            break;
          default:
            errorMessage = "Something went wrong";
        }
        toast.error(errorMessage);
      }
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
