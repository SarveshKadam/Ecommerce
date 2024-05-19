import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const mongodbUri = process.env.MONGODB_URI || "";
const port = process.env.PORT;

mongoose.connect(mongodbUri);

app.use("/user", userRouter);

app.use("/product", productRouter);

app.listen(port, () => {
  console.log("Server is running on " + port);
});
