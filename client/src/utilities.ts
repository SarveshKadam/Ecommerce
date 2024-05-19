import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://ecommerce-liart-tau.vercel.app",
});
