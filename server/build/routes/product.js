"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_1 = require("../models/product");
const user_1 = require("./user");
const user_2 = require("../models/user");
const error_1 = require("../error");
const router = (0, express_1.Router)();
exports.productRouter = router;
router.get("/", user_1.verifyToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.ProductModel.find({});
        res.json({ products });
    }
    catch (error) {
        return res.status(400).json({
            type: error,
        });
    }
}));
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        yield product_1.ProductModel.insertMany(data);
        return res.json({ message: "Data added successfully" });
    }
    catch (error) {
        return res.status(400).json({
            type: error,
        });
    }
}));
router.post("/checkout", user_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, cartItems } = req.body || {};
        const user = yield user_2.User.findById(customerId);
        if (!user) {
            return res.status(400).json({
                type: error_1.UserErrors.NO_USER_FOUND,
            });
        }
        const productIds = Object.keys(cartItems);
        const products = yield product_1.ProductModel.find({ _id: { $in: productIds } });
        if ((productIds === null || productIds === void 0 ? void 0 : productIds.length) !== (products === null || products === void 0 ? void 0 : products.length)) {
            return res.status(400).json({
                type: error_1.ProductErrors.NO_PRODUCT_FOUND,
            });
        }
        let totalCost = 0;
        for (let item in cartItems) {
            const product = products.find((product) => String(product._id) === item);
            if (!product) {
                return res.status(400).json({
                    type: error_1.ProductErrors.NO_PRODUCT_FOUND,
                });
            }
            if (product.stock < cartItems[item]) {
                return res.status(400).json({
                    type: error_1.ProductErrors.STOCK_EMPTY,
                });
            }
            totalCost += product.price * cartItems[item];
        }
        if (totalCost > user.availableAmount) {
            return res.status(400).json({
                type: error_1.UserErrors.NOT_ENOUGH_BALANCE,
            });
        }
        user.availableAmount -= totalCost;
        user.purchasedItems.push(...productIds);
        yield user.save();
        const bulkOps = [];
        for (const key in cartItems) {
            const productID = key;
            const quantityToDeduct = cartItems[key];
            const updateOperation = {
                updateOne: {
                    filter: { _id: productID },
                    update: { $inc: { stock: -quantityToDeduct } },
                },
            };
            bulkOps.push(updateOperation);
        }
        yield product_1.ProductModel.bulkWrite(bulkOps);
        res.json({ purchasedItems: products });
    }
    catch (error) {
        res.status(500).json({
            type: error,
        });
    }
}));
router.get("/purchased-items/:customerID", user_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerID } = req.params;
    try {
        const user = yield user_2.User.findById(customerID);
        if (!user) {
            return res.status(400).json({ type: error_1.UserErrors.NO_USER_FOUND });
        }
        const products = yield product_1.ProductModel.find({
            _id: { $in: user.purchasedItems },
        });
        res.json({ purchasedItems: products });
    }
    catch (error) {
        res.status(400).json({
            type: error,
        });
    }
}));
