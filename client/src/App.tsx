/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Navbar } from "./components/Navbar";
import CheckoutPage from "./pages/checkout";
import Login from "./pages/login";
import PurchasedItemsPage from "./pages/orders";
import Shop from "./pages/shop";
import SignUp from "./pages/signup";
import { useShopStore } from "./store";

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Shop />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/orders",
        element: <PurchasedItemsPage />,
      },
    ],
  },
]);

function App() {
  const [cookies] = useCookies(["access_token"]);
  const {
    fetchPurchasedItems,
    fetchAvailableMoney,
    setIsAuthenticated,
    isAuthenticated,
  } = useShopStore();

  useEffect(() => {
    if (cookies?.access_token) {
      setIsAuthenticated(true);
    }
  }, [cookies?.access_token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPurchasedItems();
      fetchAvailableMoney();
    }
  }, [isAuthenticated]);
  return (
    <div className="App">
      <ToastContainer position="top-center" theme="colored" />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
