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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.verifyToken = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const error_1 = require("../error");
const router = (0, express_1.Router)();
exports.userRouter = router;
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body || {};
        const user = yield user_1.User.findOne({ username });
        if (user) {
            return res.status(400).json({
                type: error_1.UserErrors.USER_ALREADY_EXISTS,
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newuser = new user_1.User({ username, password: hashedPassword });
        const usercreated = yield newuser.save();
        if (usercreated) {
            res.json({ message: "User registered successfully" });
        }
    }
    catch (error) {
        return res.status(500).json({
            type: error,
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body || {};
        const user = yield user_1.User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                error: error_1.UserErrors.NO_USER_FOUND,
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                error: error_1.UserErrors.WRONG_CREDENTIALS,
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, "secret123");
        return res.json({ token, userID: user._id });
    }
    catch (error) {
        res.status(500).json({
            type: error,
        });
    }
}));
const verifyToken = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (authToken) {
        jsonwebtoken_1.default.verify(authToken, "secret123", (err) => {
            if (err) {
                return res.sendStatus(403);
            }
        });
        next();
    }
    else {
        return res.sendStatus(401);
    }
};
exports.verifyToken = verifyToken;
router.get("/available-money/:userID", exports.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield user_1.User.findById(userID);
        if (!user) {
            return res.status(400).json({
                error: error_1.UserErrors.NO_USER_FOUND,
            });
        }
        res.json({
            availableMoney: user.availableAmount,
        });
    }
    catch (error) {
        res.status(500).json({
            type: error,
        });
    }
}));
