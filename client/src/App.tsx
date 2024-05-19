import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Navbar } from "./components/Navbar";
import CheckoutPage from "./pages/checkout";
import Login from "./pages/login";
import Shop from "./pages/shop";
import SignUp from "./pages/signup";

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
        element: <div>Orders</div>,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-center" theme="colored" />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
