import { produce } from "immer";
import { toast } from "react-toastify";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { axiosInstance } from "../../utilities";

const initialState = {
  products: [],
  loading: false,
};

const store = (set: (arg0: any) => void, get: any) => {
  const actions = {
    fetchProducts: async (params) => {
      try {
        const { headers } = params;
        const response = await axiosInstance.get("/product", {
          headers,
        });
        set(
          produce((draft: any) => {
            draft.products = response?.data?.products;
          })
        );
      } catch (error) {
        toast.error("Unable to fetch products");
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

const useProductStore = create(devStore);

export default useProductStore;
