"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("./routes/user");
const product_1 = require("./routes/product");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const mongodbUri = process.env.MONGODB_URI || "";
const port = process.env.PORT;
mongoose_1.default.connect(mongodbUri);
app.use("/user", user_1.userRouter);
app.use("/product", product_1.productRouter);
app.listen(port, () => {
    console.log("Server is running on " + port);
});
