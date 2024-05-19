"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    imageURL: { type: String, required: true },
    price: { type: Number, required: true, min: [0, "Price should be greater than 1."] },
    stock: { type: Number, required: true, min: [0, "Stock should be greater than 1."] },
});
exports.ProductModel = (0, mongoose_1.model)("product", productSchema);
