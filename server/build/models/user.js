"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    availableAmount: { type: Number, default: 5000 },
    purchasedItems: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "product", default: [] },
    ],
});
exports.User = (0, mongoose_1.model)("user", userSchema);
